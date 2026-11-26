"use client";

import { useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAction, useAdminQuery, writeAdmin } from "../_lib/api";
import { questionLabels, type Mapping, type QuestionType } from "../_lib/contracts";
import { Empty, ErrorNotice, Field, Heading, Panel, Pending, Pill, QueryError } from "../_components/ui";
import { useUnsavedChanges } from "../_lib/use-unsaved";

export default function MappingPage() {
  const query = useAdminQuery<Mapping[]>("lesson-mappings");
  return <>
    <Heading title="Lesson mapping" description="Choose the default lesson recommended after each type of Reading mistake." />
    {query.isPending ? <Pending label="Loading lesson mappings…" /> : query.isError ?
      <QueryError error={query.error} retry={() => void query.refetch()} /> :
      query.data.length ? <MappingForm rows={query.data} /> :
        <Empty title="No question types available" />}
  </>;
}

function MappingForm({ rows }: { rows: Mapping[] }) {
  const [changes, setChanges] = useState<Partial<Record<QuestionType, string>>>({});
  const save = useAdminAction(
    (mappings: { questionType: QuestionType; lessonId: string | null }[]) =>
      writeAdmin("put", "lesson-mappings", { mappings }),
    ["lesson-mappings"], "Lesson mappings saved.", () => setChanges({}),
  );

  const selected = (row: Mapping) => changes[row.questionType] ?? row.selectedLesson?.id ?? "";
  const dirty = rows.some((row) => selected(row) !== (row.selectedLesson?.id ?? ""));
  const hasUnavailable = rows.some((row) => selected(row) && !row.options.some((option) => option.id === selected(row)));
  useUnsavedChanges(dirty);

  return <form className="space-y-5" onSubmit={(event) => {
    event.preventDefault();
    if (dirty && !hasUnavailable && !save.isPending) {
      save.mutate(rows.map((row) => ({ questionType: row.questionType, lessonId: selected(row) || null })));
    }
  }}>
    <div className="flex items-start gap-3 rounded-frame border border-primary/30 bg-primary-soft p-4 text-sm">
      <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
      <p>Only published lessons matching the question type are eligible. Choose <strong>No default lesson</strong> to clear a recommendation.</p>
    </div>
    {rows.map((row, index) => {
      const chosen = selected(row);
      const current = row.selectedLesson;
      const unavailable = Boolean(current && !row.isEnabled);
      return <Panel key={row.questionType} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">{questionLabels[row.questionType]}</h2>
          <Pill tone={row.isEnabled ? "success" : "neutral"}>{row.isEnabled ? "Mapping enabled" : "Mapping disabled"}</Pill>
        </div>
        <Field name={`mappings[${index}].lessonId`} label="Default suggested lesson" error={save.error}>
          {(props) => <select {...props} value={chosen} disabled={save.isPending} onChange={(event) => {
            save.reset();
            setChanges((previous) => ({ ...previous, [row.questionType]: event.target.value }));
          }}>
            <option value="">No default lesson</option>
            {unavailable && current && <option value={current.id} disabled>{current.title} ({current.status})</option>}
            {row.options.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}
          </select>}
        </Field>
        {!row.options.length && <p className="text-sm text-muted-foreground">No published lessons match this question type.</p>}
        {current && <Link className="inline-block text-sm font-medium text-accent-foreground underline" href={`/admin/lessons/${current.id}`}>View saved lesson</Link>}
      </Panel>;
    })}
    {dirty && hasUnavailable && <p role="status" className="rounded-xl bg-warning-soft p-3 text-sm text-warning-soft-foreground">Replace or clear the unavailable lesson to save your changes.</p>}
    <ErrorNotice error={save.error} omitFields={rows.map((_, index) => `mappings[${index}].lessonId`)} />
    <Button type="submit" className="h-11 w-full rounded-xl bg-[#6341e8] sm:w-auto" disabled={!dirty || hasUnavailable || save.isPending}>{save.isPending ? "Saving…" : "Save lesson mappings"}</Button>
  </form>;
}
