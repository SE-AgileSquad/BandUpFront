"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAdminAction, useAdminQuery, writeAdmin } from "../_lib/api";
import { isResourceId, type Prompt, type PromptInput } from "../_lib/contracts";
import { useUnsavedChanges } from "../_lib/use-unsaved";
import { Confirm, dateLabel, Empty, Field, formData, intRange, nonblank, Panel, Pill, value } from "./ui";
import { EditorFeedback, EditorHeading, EditorLoading, Preview, SaveButton } from "./editor-ui";

const back = { href: "/admin/prompts", label: "Writing Prompts" };
const fields = ["title", "taskText", "essayType", "minWords", "maxWords"];

export function PromptEditor({ id }: { id: string }) {
  const isNew = id === "new";
  const valid = isResourceId(id);
  const query = useAdminQuery<Prompt>(`writing-prompts/${id}`, undefined, valid);
  if (isNew) return <PromptForm />;
  if (!valid) return <><EditorHeading resource="prompt" title="Prompt unavailable" back={back} /><Empty title="Prompt not found" /></>;
  if (query.isError || !query.data) return <EditorLoading resource="prompt" back={back} error={query.error} retry={() => void query.refetch()} />;
  return <PromptForm key={id} prompt={query.data} />;
}

function PromptForm({ prompt }: { prompt?: Prompt }) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [minimum, setMinimum] = useState(prompt?.minWords ?? 100);
  const collection = "writing-prompts";
  const path = `${collection}/${prompt?.id}`;
  const resources = [collection];
  const save = useAdminAction(
    async (input: PromptInput) => prompt ? writeAdmin("put", path, input) : writeAdmin<{ id: string }>("post", collection, input),
    resources, prompt ? "Draft saved." : "Draft created.",
    (result) => { setDirty(false); if (result) router.replace(`${back.href}/${result.id}`); },
  );
  const update = useAdminAction((action: "publish" | "archive") => writeAdmin("post", `${path}/${action}`), resources, "Prompt status updated.");
  const duplicate = useAdminAction(() => writeAdmin<{ id: string }>("post", `${path}/duplicate`), resources, "Draft duplicated.",
    ({ id }) => router.push(`${back.href}/${id}`));
  const remove = useAdminAction(() => writeAdmin("delete", path), resources, "Draft deleted.", () => router.replace(back.href));
  const busy = save.isPending || update.isPending || duplicate.isPending || remove.isPending;
  useUnsavedChanges(dirty);

  return <>
    <EditorHeading resource="writing prompt" title={prompt?.title} status={prompt?.status} back={back}><Pill tone="brand">Writing · Task 2</Pill></EditorHeading>
    {prompt?.isReadOnly ? <>
      <Panel className="space-y-2">
        <h2 className="text-xl font-semibold">Prompt details</h2>
        <p className="text-sm text-muted-foreground">{prompt.essayType} · {prompt.minWords}–{prompt.maxWords} words · Updated {dateLabel(prompt.updatedAt)}</p>
        <p className="text-sm text-muted-foreground">Duplicate this prompt to edit a new draft.</p>
      </Panel>
      <Preview title="Task text" text={prompt.taskText} />
    </> : <Panel>
      <form className="space-y-4" onChange={() => setDirty(true)} onSubmit={(event) => {
        const data = formData(event);
        if (!busy) save.mutate({
          title: value(data, "title"), taskText: value(data, "taskText"), essayType: value(data, "essayType"),
          minWords: Number(data.get("minWords")), maxWords: Number(data.get("maxWords")),
        });
      }}>
        <h2 className="text-xl font-semibold">Prompt details</h2>
        <fieldset className="grid gap-4" disabled={busy}>
          <Field label="Title" name="title" error={save.error}>{(props) => <input {...props} defaultValue={prompt?.title} maxLength={320} required onInput={nonblank} />}</Field>
          <Field label="Task text" name="taskText" error={save.error}>{(props) => <textarea {...props} defaultValue={prompt?.taskText} rows={8} required onInput={nonblank} />}</Field>
          <Field label="Essay type" name="essayType" error={save.error}>{(props) => <input {...props} defaultValue={prompt?.essayType ?? "Opinion essay"} maxLength={100} required onInput={nonblank} />}</Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Minimum words" name="minWords" error={save.error}>{(props) => <input {...props} type="number" {...intRange} min={1} defaultValue={minimum}
              onChange={(event) => setMinimum(event.currentTarget.valueAsNumber || 1)} required />}</Field>
            <Field label="Maximum words" name="maxWords" error={save.error}>{(props) => <input {...props} type="number" {...intRange} min={Math.max(1, minimum)} defaultValue={prompt?.maxWords ?? 350} required />}</Field>
          </div>
        </fieldset>
        <EditorFeedback error={save.error} fields={fields}><SaveButton pending={save.isPending} disabled={busy || Boolean(prompt && !dirty)}>{prompt ? "Save draft" : "Create draft"}</SaveButton></EditorFeedback>
      </form>
    </Panel>}
    {prompt && <Panel className="space-y-3">
      <h2 className="text-xl font-semibold">Publication</h2>
      {!prompt.isReadOnly && <Preview title="Saved task preview" text={prompt.taskText} />}
      {dirty && <p className="text-sm text-muted-foreground">Save your changes before publishing or duplicating.</p>}
      <div className="flex flex-wrap gap-2">
        {prompt.status === "Draft" && <>
          <Confirm label="Publish prompt" title="Publish this prompt?" description="The published prompt becomes read-only. To edit it later, create a new draft copy." action={() => update.mutateAsync("publish")} disabled={dirty || busy} />
          <Confirm label="Delete draft" title="Delete this prompt draft?" description="This permanently removes the draft if it has no references." action={() => remove.mutateAsync()} disabled={busy} destructive />
        </>}
        {prompt.status === "Published" && <Confirm label="Archive prompt" title="Archive this prompt?" description="The original prompt and its history will be retained." action={() => update.mutateAsync("archive")} disabled={busy} destructive />}
        <Button type="button" variant="outline" disabled={dirty || busy} onClick={() => duplicate.mutate()}>{duplicate.isPending ? "Duplicating…" : "Duplicate as draft"}</Button>
      </div>
      <EditorFeedback error={duplicate.error} />
    </Panel>}
  </>;
}
