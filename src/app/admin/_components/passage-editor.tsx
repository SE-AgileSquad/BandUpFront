"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/types/api";
import { useAdminAction, useAdminQuery, writeAdmin } from "../_lib/api";
import { isResourceId, type Passage, type PassageInput } from "../_lib/contracts";
import { useUnsavedChanges } from "../_lib/use-unsaved";
import { Confirm, dateLabel, Empty, Field, formData, nonblank, Panel, Pill, ReadinessNotice, SectionLinks, value } from "./ui";
import { EditorFeedback, EditorHeading, EditorLoading, Preview, SaveButton } from "./editor-ui";
import { QuestionCard, QuestionDialog, passageResources } from "./passage-questions";

const back = { href: "/admin/passages", label: "Passages" };
const fields = ["title", "sourceNote", "usageBasis", "body"];
const sections = [["details", "Details"], ["text", "Text"], ["questions", "Questions"], ["review", "Review & publish"]] as const;

export function PassageEditor({ id }: { id: string }) {
  const isNew = id === "new";
  const valid = isResourceId(id);
  const query = useAdminQuery<Passage>(`passages/${id}`, undefined, valid);
  if (isNew) return <PassageForm />;
  if (!valid) return <><EditorHeading resource="passage" title="Passage unavailable" back={back} /><Empty title="Passage not found" /></>;
  if (query.isError || !query.data) return <EditorLoading resource="passage" back={back} error={query.error} retry={() => void query.refetch()} />;
  return <PassageForm key={id} passage={query.data} />;
}

function PassageForm({ passage }: { passage?: Passage }) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [wordCount, setWordCount] = useState(passage?.wordCount ?? 0);
  const path = `passages/${passage?.id}`;
  const save = useAdminAction(
    async (input: PassageInput) => passage ? writeAdmin("put", path, input) : writeAdmin<{ id: string }>("post", "passages", input),
    passageResources, passage ? "Draft saved." : "Draft created.",
    (result) => { setDirty(false); if (result) router.replace(`${back.href}/${result.id}`); },
  );
  const publish = useAdminAction(() => writeAdmin("post", `${path}/publish`, { reviewConfirmed: reviewed }), passageResources, "Passage published.");
  const remove = useAdminAction(() => writeAdmin("delete", path), passageResources, passage?.status === "Published" ? "Passage archived." : "Draft deleted.",
    () => { if (passage?.status === "Draft") router.replace(back.href); });
  const revise = useAdminAction(() => writeAdmin<{ id: string }>("post", `${path}/revisions`), passageResources, "Draft revision created.",
    ({ id }) => router.push(`${back.href}/${id}`));
  const busy = save.isPending || publish.isPending || remove.isPending || revise.isPending;
  useUnsavedChanges(dirty);

  return <>
    <EditorHeading resource="passage" title={passage?.title} status={passage?.status} back={back}>
      <div className="flex flex-wrap gap-2"><Pill tone="brand">Academic Reading · 20 minutes</Pill>{passage && <Pill>Version {passage.version}</Pill>}</div>
    </EditorHeading>
    <SectionLinks sections={passage ? sections : sections.slice(0, 2)} />
    {passage?.isReadOnly ? <>
      <Panel id="details" className="scroll-mt-20 space-y-2">
        <h2 className="text-xl font-semibold">Passage details</h2>
        <p className="text-sm text-muted-foreground">{passage.wordCount} words · Updated {dateLabel(passage.updatedAt)}</p>
        <p className="text-sm wrap-break-word">Source: {passage.sourceNote}</p>
        <p className="text-sm wrap-break-word">Usage basis: {passage.usageBasis}</p>
      </Panel>
      <div id="text" className="scroll-mt-20"><Preview title="Passage text" text={passage.body} /></div>
    </> : <form className="grid gap-4" onChange={() => { setDirty(true); setReviewed(false); }} onSubmit={(event) => {
      const data = formData(event);
      if (!busy) save.mutate({ title: value(data, "title"), body: String(data.get("body") ?? ""), sourceNote: value(data, "sourceNote"), usageBasis: value(data, "usageBasis") });
    }}>
      <Panel id="details" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold">Passage details</h2>
        <fieldset className="grid gap-4" disabled={busy}>
          <Field label="Title" name="title" error={save.error}>{(props) => <input {...props} defaultValue={passage?.title} required onInput={nonblank} />}</Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Source note" name="sourceNote" error={save.error}>{(props) => <input {...props} defaultValue={passage?.sourceNote ?? "BandUp team"} required onInput={nonblank} />}</Field>
            <Field label="Usage basis" name="usageBasis" error={save.error}>{(props) => <input {...props} defaultValue={passage?.usageBasis ?? "Original content"} required onInput={nonblank} />}</Field>
          </div>
        </fieldset>
      </Panel>
      <Panel id="text" className="scroll-mt-20 space-y-4 bg-passage">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold">Original passage text</h2><Pill>{wordCount} words</Pill></div>
        <Field label="Passage text" name="body" error={save.error} hint="Use original text and record its source and usage basis. Changing the saved passage text clears question verification.">
          {(props) => <textarea {...props} rows={10} defaultValue={passage?.body} required disabled={busy} onInput={(event) => {
            nonblank(event);
            const text = event.currentTarget.value.trim();
            setWordCount(text ? text.split(/\s+/).length : 0);
          }} />}
        </Field>
        <EditorFeedback error={save.error} fields={fields}>
          <SaveButton pending={save.isPending} disabled={busy || Boolean(passage && !dirty)}>{passage ? "Save draft" : "Create draft"}</SaveButton>
        </EditorFeedback>
      </Panel>
    </form>}
    {passage && <>
      <section id="questions" className="grid scroll-mt-20 gap-3">
        <Panel className="flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-xl font-semibold">Questions</h2><p className="text-sm text-muted-foreground">{passage.questions.length} saved · {passage.questions.filter((item) => item.answerKey?.isVerified).length} verified</p></div>
          {!passage.isReadOnly && <QuestionDialog passage={passage} disabled={busy || dirty} changed={() => setReviewed(false)} />}
        </Panel>
        {!passage.questions.length && <Empty title="No questions yet" description="Add a True / False / Not Given or Sentence Completion question." />}
        {passage.questions.map((question, index) => <QuestionCard key={question.id} {...{ passage, question, index }} disabled={busy || dirty} changed={() => setReviewed(false)} />)}
      </section>
      <Panel id="review" className="scroll-mt-20 space-y-4">
        <h2 className="text-xl font-semibold">{passage.isReadOnly ? "Manage publication" : "Review & publish"}</h2>
        {!passage.isReadOnly && <>
          <ReadinessNotice readiness={passage.publishReadiness} fieldLink={(key) => {
            const questionId = key.match(/^questions\.([\da-f-]+)\./i)?.[1];
            if (questionId) return `#question-${questionId}`;
            if (key.startsWith("questions")) return "#questions";
            return key === "body" ? "#text" : "#details";
          }} />
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 size-4 accent-primary" checked={reviewed} disabled={busy || dirty || !passage.publishReadiness.isReady} onChange={(event) => setReviewed(event.target.checked)} />
            I have reviewed the original text and every answer.
          </label>
          {dirty && <p className="text-sm text-muted-foreground">Save the passage before editing questions or publishing.</p>}
        </>}
        <div className="flex flex-wrap gap-2">
          {!passage.isReadOnly && <>
            <Confirm label="Publish passage" title="Publish this passage?" description="Learners will be able to use this passage. To edit it after publication, create a draft revision."
              disabled={busy || dirty || !reviewed || !passage.publishReadiness.isReady} action={async () => {
                try {
                  await publish.mutateAsync();
                } catch (error) {
                  if (error instanceof ApiError && error.status === 409) setReviewed(false);
                  throw error;
                }
              }} />
            <Confirm label="Delete draft" title="Delete this passage draft?" description="The draft and its questions will be removed if no records reference them."
              action={() => remove.mutateAsync()} disabled={busy} destructive />
          </>}
          {passage.canCreateRevision && <Button type="button" className="bg-[#6341e8]" disabled={busy} onClick={() => revise.mutate()}>{revise.isPending ? "Creating revision…" : "Duplicate as draft"}</Button>}
          {passage.status === "Published" && <Confirm label="Archive passage" title="Archive this passage?" description="The passage will be removed from the learner catalog. Existing attempts and history are retained."
            action={() => remove.mutateAsync()} disabled={busy} destructive />}
        </div>
        <EditorFeedback error={revise.error} />
      </Panel>
    </>}
  </>;
}
