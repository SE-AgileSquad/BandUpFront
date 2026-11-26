"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminQuery } from "../_lib/api";
import { questionLabels, questionTypes, statuses, type LessonSummary, type Page, type PassageSummary, type PromptSummary } from "../_lib/contracts";
import { dateLabel, Empty, Field, Filters, Heading, Pagination, Panel, Pending, QueryError, StatusPill } from "./ui";

type Kind = "passages" | "lessons" | "prompts";
type Item = PassageSummary | LessonSummary | PromptSummary;

const settings = {
  passages: { title: "Passages", noun: "passage", path: "passages", description: "Manage Academic Reading passages, questions and answer verification.", art: "books", width: 173, height: 162 },
  lessons: { title: "Lessons", noun: "lesson", path: "lessons", description: "Manage Reading lessons and their evidence and paraphrase examples.", art: "lesson", width: 64, height: 72 },
  prompts: { title: "Writing Prompts", noun: "prompt", path: "writing-prompts", description: "Manage Task 2 essay prompts and their word limits.", art: "prompt", width: 92, height: 54 },
};

const options = [{ value: "", label: "All" }, ...statuses.map((status) => ({ value: status, label: status }))];

export function useListSearch() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(input.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [input]);
  return { input, search, setInput };
}

export function SearchField({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: string; onChange: (value: string) => void;
}) {
  return <Field label={label} name="search">{(props) => <div className="relative">
    <Search aria-hidden className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />
    <input {...props} type="search" className={`${props.className} pl-9`} placeholder={placeholder} maxLength={320}
      value={value} onChange={(event) => onChange(event.target.value)} />
  </div>}</Field>;
}

export function ContentList({ kind, initialStatus = "" }: { kind: Kind; initialStatus?: string }) {
  const config = settings[kind];
  const base = `/admin/${kind}`;
  const { input, search, setInput } = useListSearch();
  const [status, setStatus] = useState(initialStatus);
  const [questionType, setQuestionType] = useState("");
  const [position, setPosition] = useState({ page: 1, search: "" });
  const page = position.search === search ? position.page : 1;
  const result = useAdminQuery<Page<Item>>(config.path, {
    page, pageSize: 4, search: search || undefined, status: status || undefined, questionType: questionType || undefined,
  });
  const newLink = <Button asChild className="h-11 rounded-xl bg-[#6341e8] font-semibold"><Link href={`${base}/new`}><Plus aria-hidden />New {config.noun}</Link></Button>;

  return <>
    <Heading title={config.title} description={config.description} action={newLink} />
    <Panel className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <SearchField label={`Search ${config.title.toLowerCase()}`} placeholder="Search by title…" value={input} onChange={(value) => { setInput(value); setPosition({ page: 1, search }); }} />
        {kind === "lessons" && <Field name="questionType" label="Question type">{(props) =>
          <select {...props} value={questionType} onChange={(event) => { setQuestionType(event.target.value); setPosition({ page: 1, search }); }}>
            <option value="">All question types</option>
            {questionTypes.map((type) => <option key={type} value={type}>{questionLabels[type]}</option>)}
          </select>}</Field>}
      </div>
      <Filters label="Publication status" value={status} choices={options} onChange={(value) => { setStatus(value); setPosition({ page: 1, search }); }} />
    </Panel>
    {result.isPending ? <Pending label={`Loading ${config.title.toLowerCase()}…`} /> :
      result.isError ? <QueryError error={result.error} retry={() => void result.refetch()} /> :
      <>
        {result.data.items.length ? <ul className="grid gap-4" aria-label={config.title}>
          {result.data.items.map((item) => <li key={item.id}><Panel className="flex items-center gap-4 sm:gap-8">
            <div className="min-w-0 flex-1 space-y-2">
              <StatusPill status={item.status} />
              <h2 className="text-xl font-semibold break-words">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{itemSummary(item)}</p>
              <Button asChild variant="outline" className="mt-1 h-10 w-full rounded-xl sm:w-auto">
                <Link href={`${base}/${item.id}`} aria-label={`${item.status === "Draft" ? "Edit draft" : "View details"}: ${item.title}`}>
                  {item.status === "Draft" ? "Edit draft" : "View details"}<ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
            <div className="hidden w-24 shrink-0 justify-center sm:flex">
              <Image src={`/images/admin/${config.art}.png`} alt="" width={config.width} height={config.height} className="h-auto max-h-22 w-auto max-w-full object-contain" />
            </div>
          </Panel></li>)}
        </ul> : <Empty title={`No ${config.title.toLowerCase()} found`}
          description={input || status || questionType ? "Try a different search or filter." : "Create a draft to add the first item."}
          action={!input && !status && !questionType && !result.data.totalCount ? newLink : undefined} />}
        <Pagination result={result.data} setPage={(page) => setPosition({ page, search })} />
      </>}
  </>;
}

function itemSummary(item: Item) {
  if ("questionCount" in item) return `${item.questionCount} questions · Academic Reading · Version ${item.version} · Updated ${dateLabel(item.updatedAt)}`;
  if ("exampleCount" in item) return `${questionLabels[item.questionType]} · Order ${item.sortOrder} · ${item.exampleCount} examples${item.hasPractice ? " · Practice included" : ""}`;
  return `Task ${item.taskNumber} · ${item.essayType} · ${item.minWords}–${item.maxWords} words · Updated ${dateLabel(item.updatedAt)}`;
}
