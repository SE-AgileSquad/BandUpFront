"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdminAction, useAdminQuery, writeAdmin } from "../_lib/api";
import { isResourceId, questionLabels, questionTypes, type ExampleInput, type Lesson, type LessonInput, type QuestionType } from "../_lib/contracts";
import { useUnsavedChanges } from "../_lib/use-unsaved";
import { Confirm, Empty, Field, formData, intRange, nonblank, Panel, ReadinessNotice, SectionLinks, value } from "./ui";
import { EditorFeedback, EditorHeading, EditorLoading, Preview, SaveButton } from "./editor-ui";

const back = { href: "/admin/lessons", label: "Lessons" };
const resources = ["lessons", "lesson-mappings", "dashboard"];
const lessonFields = ["title", "body", "questionType", "sortOrder"];
const exampleFields = ["evidenceSentence", "paraphrase", "sortOrder"];
type Example = Lesson["examples"][number];

export function LessonEditor({ id }: { id: string }) {
  const isNew = id === "new";
  const valid = isResourceId(id);
  const query = useAdminQuery<Lesson>(`lessons/${id}`, undefined, valid);
  if (isNew) return <LessonForm />;
  if (!valid) return <><EditorHeading resource="lesson" title="Lesson unavailable" back={back} /><Empty title="Lesson not found" /></>;
  if (query.isError || !query.data) return <EditorLoading resource="lesson" back={back} error={query.error} retry={() => void query.refetch()} />;
  return <LessonForm key={id} lesson={query.data} />;
}

function LessonForm({ lesson }: { lesson?: Lesson }) {
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  const path = `lessons/${lesson?.id}`;
  const save = useAdminAction(
    async (input: LessonInput) => lesson ? writeAdmin("put", path, input) : writeAdmin<{ id: string }>("post", "lessons", input),
    resources, lesson ? "Lesson saved." : "Draft created.",
    (result) => { setDirty(false); if (result) router.replace(`${back.href}/${result.id}`); },
  );
  const update = useAdminAction((action: "publish" | "archive") => writeAdmin("post", `${path}/${action}`), resources, "Lesson status updated.");
  const remove = useAdminAction(() => writeAdmin("delete", path), resources, "Lesson deleted.", () => router.replace(back.href));
  const busy = save.isPending || update.isPending || remove.isPending;
  useUnsavedChanges(dirty);

  return <>
    <EditorHeading resource="lesson" title={lesson?.title} status={lesson?.status} back={back} />
    {lesson && <SectionLinks sections={[["details", "Details"], ["examples", "Examples"], ["review", "Review"]]} />}
    <Panel id="details" className="scroll-mt-20">
      {lesson?.isReadOnly ? <div className="space-y-2">
        <h2 className="text-xl font-semibold">Lesson details</h2>
        <p className="text-sm text-muted-foreground">{questionLabels[lesson.questionType]} · Order {lesson.sortOrder} · Archived lesson</p>
      </div> : <form className="space-y-4" onChange={() => setDirty(true)} onSubmit={(event) => {
        const data = formData(event);
        if (!busy) save.mutate({
          title: value(data, "title"), body: String(data.get("body") ?? ""),
          questionType: lesson && !lesson.canChangeQuestionType ? lesson.questionType : value(data, "questionType") as QuestionType,
          sortOrder: Number(data.get("sortOrder")),
        });
      }}>
        <h2 className="text-xl font-semibold">Lesson details</h2>
        <fieldset className="grid gap-4" disabled={busy}>
          <Field label="Title" name="title" error={save.error}>{(props) => <input {...props} defaultValue={lesson?.title} required onInput={nonblank} />}</Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Question type" name="questionType" error={save.error}
              hint={lesson && !lesson.canChangeQuestionType ? "The question type is fixed for this lesson." : undefined}>
              {(props) => <select {...props} defaultValue={lesson?.questionType ?? ""} required disabled={Boolean(lesson && !lesson.canChangeQuestionType)}>
                <option value="" disabled>Select a question type</option>
                {questionTypes.map((type) => <option key={type} value={type}>{questionLabels[type]}</option>)}
              </select>}
            </Field>
            <Field label="Sort order" name="sortOrder" error={save.error}>{(props) =>
              <input {...props} {...intRange} type="number" defaultValue={lesson?.sortOrder ?? 0} required />}</Field>
          </div>
          <Field label="Lesson content" name="body" error={save.error}>{(props) => <textarea {...props} rows={8} defaultValue={lesson?.body} required onInput={nonblank} />}</Field>
        </fieldset>
        <EditorFeedback error={save.error} fields={lessonFields}><SaveButton pending={save.isPending} disabled={busy || Boolean(lesson && !dirty)}>{lesson ? "Save changes" : "Create draft"}</SaveButton></EditorFeedback>
      </form>}
    </Panel>
    {lesson && <>
      <LessonExamples lesson={lesson} disabled={busy} />
      <div id="review" className="grid scroll-mt-20 gap-4">
        <Preview title="Saved lesson preview" text={lesson.body} />
        <Panel className="space-y-3">
          <h2 className="text-xl font-semibold">Publication</h2>
          {lesson.status === "Draft" && <ReadinessNotice readiness={lesson.publishReadiness} fieldLink={(key) => key.startsWith("examples") ? "#examples" : "#details"} />}
          {dirty && <p className="text-sm text-muted-foreground">Save your changes before updating the publication status.</p>}
          <div className="flex flex-wrap gap-2">
            {lesson.status === "Draft" && <Confirm label="Publish lesson" title="Publish this lesson?" description="Learners will be able to open the lesson. You can continue to edit its content after publishing."
              action={() => update.mutateAsync("publish")} disabled={busy || dirty || !lesson.publishReadiness.isReady} />}
            {lesson.status === "Published" && <Confirm label="Archive lesson" title="Archive this lesson?" description="Learners will lose access to this lesson. Progress and existing mappings are retained."
              action={() => update.mutateAsync("archive")} disabled={busy || dirty} destructive />}
            <Confirm label="Delete lesson" title="Delete this lesson permanently?" description="You can delete a lesson only if no learner progress or mappings reference it."
              action={() => remove.mutateAsync()} disabled={busy} destructive />
          </div>
        </Panel>
      </div>
    </>}
  </>;
}

function LessonExamples({ lesson, disabled }: { lesson: Lesson; disabled: boolean }) {
  const path = `lessons/${lesson.id}/examples`;
  const reorder = useAdminAction((exampleIds: string[]) => writeAdmin("put", `${path}/order`, { exampleIds }), resources, "Example order saved.");

  function move(index: number, offset: number) {
    const ids = lesson.examples.map((example) => example.id);
    const next = index + offset;
    [ids[index], ids[next]] = [ids[next], ids[index]];
    reorder.mutate(ids);
  }

  return <section id="examples" className="grid scroll-mt-20 gap-3">
    <Panel className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-semibold">Examples</h2><p className="text-sm text-muted-foreground">{lesson.exampleCount} saved · {lesson.hasPractice ? "Practice included" : "Add at least one example to publish"}</p></div>
      {!lesson.isReadOnly && <ExampleDialog path={path} nextOrder={Math.min(intRange.max, (lesson.examples.at(-1)?.sortOrder ?? 0) + 1)} disabled={disabled || reorder.isPending} />}
    </Panel>
    {!lesson.examples.length && <Empty title="No examples yet" description="Add an evidence sentence and its paraphrase." />}
    {lesson.examples.map((example, index) => <ExampleCard key={example.id} {...{ example, index, lesson, path, move }} disabled={disabled || reorder.isPending} />)}
    <EditorFeedback error={reorder.error} />
  </section>;
}

function ExampleCard({ example, lesson, index, path, move, disabled }: {
  example: Example; lesson: Lesson; index: number; path: string; move: (index: number, offset: number) => void; disabled: boolean;
}) {
  const remove = useAdminAction(() => writeAdmin("delete", `${path}/${example.id}`), resources, "Example deleted.");
  const protectedExample = lesson.status === "Published" && lesson.examples.length === 1;
  return <Panel className="space-y-3">
    <h3 className="font-semibold">Example {index + 1}</h3>
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div className="min-w-0"><dt className="font-semibold text-muted-foreground">Evidence sentence</dt><dd className="mt-1 wrap-break-word whitespace-pre-wrap">{example.evidenceSentence}</dd></div>
      <div className="min-w-0"><dt className="font-semibold text-muted-foreground">Paraphrase</dt><dd className="mt-1 wrap-break-word whitespace-pre-wrap">{example.paraphrase}</dd></div>
    </dl>
    {!lesson.isReadOnly && <div className="flex flex-wrap gap-2">
      <ExampleDialog path={path} example={example} disabled={disabled || remove.isPending} />
      <Button type="button" variant="outline" size="icon" aria-label={`Move example ${index + 1} up`} disabled={disabled || index === 0} onClick={() => move(index, -1)}><ArrowUp aria-hidden /></Button>
      <Button type="button" variant="outline" size="icon" aria-label={`Move example ${index + 1} down`} disabled={disabled || index === lesson.examples.length - 1} onClick={() => move(index, 1)}><ArrowDown aria-hidden /></Button>
      {!protectedExample && <Confirm label="Delete example" title="Delete this example?" description="This removes both the evidence sentence and paraphrase."
        action={() => remove.mutateAsync()} disabled={disabled || remove.isPending} destructive />}
    </div>}
    {protectedExample && <p className="text-sm text-muted-foreground">A published lesson must keep at least one example.</p>}
  </Panel>;
}

function ExampleDialog({ path, example, disabled, nextOrder = 1 }: { path: string; example?: Example; nextOrder?: number; disabled: boolean }) {
  const [open, setOpen] = useState(false);
  const save = useAdminAction(
    (input: ExampleInput) => example ? writeAdmin("put", `${path}/${example.id}`, input) : writeAdmin("post", path, input),
    resources, "Example saved.", () => setOpen(false),
  );
  return <Dialog open={open} onOpenChange={(next) => { if (!save.isPending) { if (next) save.reset(); setOpen(next); } }}>
    <DialogTrigger asChild><Button type="button" variant="outline" disabled={disabled}>{!example && <Plus aria-hidden />}{example ? "Edit example" : "Add example"}</Button></DialogTrigger>
    <DialogContent showCloseButton={!save.isPending} className="max-h-[90dvh] overflow-auto rounded-card">
      <DialogHeader><DialogTitle>{example ? "Edit example" : "Add example"}</DialogTitle><DialogDescription>Provide an evidence sentence and its paraphrase.</DialogDescription></DialogHeader>
      <form className="space-y-4" onSubmit={(event) => {
        const data = formData(event);
        if (!save.isPending) save.mutate({ evidenceSentence: value(data, "evidenceSentence"), paraphrase: value(data, "paraphrase"), sortOrder: Number(data.get("sortOrder")) });
      }}>
        <fieldset className="grid gap-4" disabled={save.isPending}>
          <Field label="Evidence sentence" name="evidenceSentence" error={save.error}>{(props) => <textarea {...props} rows={3} defaultValue={example?.evidenceSentence} required onInput={nonblank} />}</Field>
          <Field label="Paraphrase" name="paraphrase" error={save.error}>{(props) => <textarea {...props} rows={3} defaultValue={example?.paraphrase} required onInput={nonblank} />}</Field>
          <Field label="Sort order" name="sortOrder" error={save.error}>{(props) => <input {...props} type="number" {...intRange} defaultValue={example?.sortOrder ?? nextOrder} required />}</Field>
        </fieldset>
        <EditorFeedback error={save.error} fields={exampleFields} />
        <DialogFooter>
          <Button type="button" variant="outline" disabled={save.isPending} onClick={() => setOpen(false)}>Cancel</Button>
          <SaveButton pending={save.isPending}>Save example</SaveButton>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}
