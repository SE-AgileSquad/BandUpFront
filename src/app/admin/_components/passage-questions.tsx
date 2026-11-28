"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAdminAction, writeAdmin } from "../_lib/api";
import { questionLabels, questionTypes, type Passage, type Question } from "../_lib/contracts";
import { Confirm, dateLabel, Field, formData, intRange, nonblank, Panel, Pill, value } from "./ui";
import { EditorFeedback, SaveButton } from "./editor-ui";

export const passageResources = ["passages", "dashboard"];
const questionFields = ["type", "prompt", "sortOrder"];
const answerFields = ["correctAnswer", "acceptedVariants"];
const explanationFields = ["explanation", "evidenceSentence", "misleadingSentence", "unspecifiedPart"];

export function QuestionCard({ passage, question, index, disabled, changed }: {
  passage: Passage; question: Question; index: number; disabled: boolean; changed: () => void;
}) {
  const path = `passages/${passage.id}/questions/${question.id}`;
  const verify = useAdminAction((checked: boolean) => writeAdmin(checked ? "post" : "delete", `${path}/answer-key/verify`), passageResources,
    undefined, changed);
  const remove = useAdminAction(() => writeAdmin("delete", path), passageResources, "Question deleted.", changed);
  const verified = Boolean(question.answerKey?.isVerified);
  const busy = disabled || verify.isPending || remove.isPending;

  return <Panel id={`question-${question.id}`} className="scroll-mt-20 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2"><Pill tone="brand">Question {index + 1} · {questionLabels[question.type]}</Pill>
      <Pill tone={verified ? "success" : "neutral"}>{verified ? `Verified · ${dateLabel(question.answerKey?.verifiedAt ?? null)}` : "Unverified"}</Pill>
    </div>
    <h3 className="text-lg font-semibold wrap-break-word whitespace-pre-wrap">{question.prompt}</h3>
    <dl className="grid gap-1 text-sm wrap-break-word">
      <div><dt className="inline font-semibold">Answer: </dt><dd className="inline">{question.answerKey?.correctAnswer ?? "No answer key yet"}</dd></div>
      {!!question.answerKey?.acceptedVariants.length && <div><dt className="inline font-semibold">Accepted variants: </dt><dd className="inline">{question.answerKey.acceptedVariants.join(", ")}</dd></div>}
      {question.explanation && <div><dt className="inline font-semibold">Explanation: </dt><dd className="inline">{question.explanation}</dd></div>}
      {question.evidenceSentence && <div><dt className="inline font-semibold">Evidence: </dt><dd className="inline">{question.evidenceSentence}</dd></div>}
      {question.misleadingSentence && <div><dt className="inline font-semibold">Misleading sentence: </dt><dd className="inline">{question.misleadingSentence}</dd></div>}
      {question.unspecifiedPart && <div><dt className="inline font-semibold">Information not stated: </dt><dd className="inline">{question.unspecifiedPart}</dd></div>}
    </dl>
    {!passage.isReadOnly && <>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1 size-4 accent-primary" checked={verified} disabled={busy || !question.answerKey}
          onChange={(event) => verify.mutate(event.target.checked)} />
        I checked the saved answer and explanation.
      </label>
      {verify.isPending && <p role="status" className="text-xs text-muted-foreground">Saving verification…</p>}
      <EditorFeedback error={verify.error} />
      <div className="flex flex-wrap gap-2">
        <QuestionDialog passage={passage} question={question} disabled={busy} changed={changed} />
        <Confirm label="Delete question" title="Delete this question?" description="This removes the question, answer key and explanation."
          action={() => remove.mutateAsync()} disabled={busy} destructive />
      </div>
    </>}
  </Panel>;
}

export function QuestionDialog({ passage, question, disabled, changed }: {
  passage: Passage; question?: Question; disabled: boolean; changed: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState<string[]>([]);
  const path = `passages/${passage.id}/questions`;
  const target = question ? `${path}/${question.id}` : path;
  const [working, setWorking] = useState(false);

  function close() {
    if (working || (dirty.length && !window.confirm("Discard the unsaved question changes?"))) return;
    setOpen(false);
  }
  function mark(section: string) {
    setDirty((previous) => previous.includes(section) ? previous : [...previous, section]);
  }
  function saved(section: string) {
    setDirty((previous) => previous.filter((name) => name !== section));
    changed();
    if (!question) setOpen(false);
  }

  return <Dialog open={open} onOpenChange={(next) => {
    if (next) { setDirty([]); setOpen(true); } else close();
  }}>
    <DialogTrigger asChild><Button type="button" variant="outline" disabled={disabled}>{!question && <Plus aria-hidden />}{question ? "Edit question" : "Add question"}</Button></DialogTrigger>
    <DialogContent showCloseButton={!working} className="max-h-[90dvh] overflow-auto rounded-card sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{question ? "Edit question" : "Add question"}</DialogTitle>
        <DialogDescription>{question ? "Save each section separately. Changing the prompt, key or explanation may clear verification." : "Save the question before adding its answer key and explanation."}</DialogDescription>
      </DialogHeader>
      <QuestionDetailsForm target={target} question={question} nextOrder={Math.min(2147483647, (passage.questions.at(-1)?.sortOrder ?? 0) + 1)}
        busy={working} onBusy={setWorking} onEdit={() => mark("details")} saved={() => saved("details")} />
      {question && <>
        <AnswerForm target={target} question={question} busy={working} onBusy={setWorking} onEdit={() => mark("answer")} saved={() => saved("answer")} />
        <ExplanationForm target={target} question={question} body={passage.body} busy={working} onBusy={setWorking}
          onEdit={() => mark("explanation")} saved={() => saved("explanation")} />
      </>}
      <DialogFooter><Button type="button" variant="outline" disabled={working} onClick={close}>Close</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

type FormProps = { target: string; busy: boolean; onBusy: (busy: boolean) => void; onEdit: () => void; saved: () => void };

function QuestionDetailsForm({ target, question, nextOrder, busy, onBusy, onEdit, saved }: FormProps & { question?: Question; nextOrder: number }) {
  const save = useAdminAction((input: { prompt: string; sortOrder: number; type?: string }) => writeAdmin(question ? "put" : "post", target, input), passageResources, "Question saved.", saved);
  return <form className="space-y-3" onChange={onEdit} onSubmit={(event) => {
    const data = formData(event);
    if (busy) return;
    onBusy(true);
    void save.mutateAsync({ prompt: value(data, "prompt"), sortOrder: Number(data.get("sortOrder")),
      ...(question ? {} : { type: value(data, "type") }) }).catch(() => undefined).finally(() => onBusy(false));
  }}>
    <fieldset disabled={busy} className="grid gap-3">
      {question ? <p className="text-sm font-semibold">{questionLabels[question.type]}</p> :
        <Field label="Question type" name="type" error={save.error}>{(props) => <select {...props} defaultValue="" required>
          <option value="" disabled>Select a question type</option>
          {questionTypes.map((type) => <option key={type} value={type}>{questionLabels[type]}</option>)}
        </select>}</Field>}
      <Field label="Question text" name="prompt" error={save.error}>{(props) => <textarea {...props} defaultValue={question?.prompt} rows={3} required onInput={nonblank} />}</Field>
      <Field label="Sort order" name="sortOrder" error={save.error}>{(props) => <input {...props} {...intRange} type="number" defaultValue={question?.sortOrder ?? nextOrder} required />}</Field>
    </fieldset>
    <EditorFeedback error={save.error} fields={questionFields} />
    <SaveButton pending={save.isPending} disabled={busy}>{question ? "Save question details" : "Save new question"}</SaveButton>
  </form>;
}

function AnswerForm({ target, question, busy, onBusy, onEdit, saved }: FormProps & { question: Question }) {
  const path = `${target}/answer-key`;
  const tfng = question.type === "TrueFalseNotGiven";
  const key = question.answerKey;
  const save = useAdminAction((input: { correctAnswer: string; acceptedVariants: string[] }) =>
    writeAdmin("put", path, input), passageResources, "Answer key saved.", saved);
  const clear = useAdminAction(() => writeAdmin("delete", path), passageResources, "Answer key cleared.", saved);

  return <form key={key?.correctAnswer ?? ""} className="space-y-3 border-t pt-4" onChange={onEdit} onSubmit={(event) => {
    const data = formData(event);
    if (busy) return;
    onBusy(true);
    const acceptedVariants = tfng ? [] : [...new Set(value(data, "acceptedVariants").split("\n").map((line) => line.trim()).filter(Boolean))];
    void save.mutateAsync({ correctAnswer: value(data, "correctAnswer"), acceptedVariants }).catch(() => undefined).finally(() => onBusy(false));
  }}>
    <h3 className="font-semibold">Answer key</h3>
    <fieldset disabled={busy} className="grid gap-3">
      <Field label="Correct answer" name="correctAnswer" error={save.error}>{(props) => tfng ?
        <select {...props} defaultValue={key?.correctAnswer ?? ""} required>
          <option value="" disabled>Select the answer</option>
          {["True", "False", "Not Given"].map((answer) => <option key={answer}>{answer}</option>)}
        </select> : <input {...props} defaultValue={key?.correctAnswer} required onInput={nonblank} />}</Field>
      {!tfng && <Field label="Accepted variants" name="acceptedVariants" error={save.error} hint="Enter one accepted alternative per line.">
        {(props) => <textarea {...props} defaultValue={key?.acceptedVariants.join("\n")} rows={3} />}
      </Field>}
    </fieldset>
    <EditorFeedback error={save.error} fields={answerFields} />
    <div className="flex flex-wrap gap-2">
      <SaveButton pending={save.isPending} disabled={busy}>Save answer key</SaveButton>
      {key && <Confirm label="Clear answer key" title="Clear the answer key?" description="The saved question and explanation are retained."
        disabled={busy} destructive action={async () => {
          onBusy(true);
          try { await clear.mutateAsync(); } finally { onBusy(false); }
        }} />}
    </div>
  </form>;
}

function ExplanationForm({ target, question, body, busy, onBusy, onEdit, saved }: FormProps & { question: Question; body: string }) {
  const source = useRef<HTMLTextAreaElement>(null);
  const evidence = useRef<HTMLTextAreaElement>(null);
  const [showSource, setShowSource] = useState(false);
  const [selectionError, setSelectionError] = useState(false);
  const notGiven = question.type === "TrueFalseNotGiven" && question.answerKey?.correctAnswer.toLowerCase() === "not given";
  const save = useAdminAction((input: Record<string, string | null>) =>
    writeAdmin("put", `${target}/explanation`, input), passageResources, "Explanation saved.", saved);

  function setEvidence() {
    if (!source.current || !evidence.current) return;
    const selection = source.current.value.slice(source.current.selectionStart, source.current.selectionEnd).trim();
    setSelectionError(!selection);
    if (!selection) return;
    evidence.current.value = selection;
    evidence.current.focus();
    onEdit();
  }

  return <form className="space-y-3 border-t pt-4" onChange={onEdit} onSubmit={(event) => {
    const data = formData(event);
    if (busy) return;
    onBusy(true);
    void save.mutateAsync({
      explanation: value(data, "explanation") || null, misleadingSentence: value(data, "misleadingSentence") || null,
      evidenceSentence: notGiven ? null : value(data, "evidenceSentence") || null,
      unspecifiedPart: notGiven ? value(data, "unspecifiedPart") || null : null,
    }).catch(() => undefined).finally(() => onBusy(false));
  }}>
    <h3 className="font-semibold">Explanation and evidence</h3>
    <fieldset disabled={busy} className="grid gap-3">
      <Field label="Explanation" name="explanation" error={save.error}>{(props) => <textarea {...props} defaultValue={question.explanation ?? ""} rows={3} />}</Field>
      {notGiven ? <Field label="Information not stated" name="unspecifiedPart" error={save.error} hint="Identify the missing information for a Not Given answer.">
        {(props) => <textarea {...props} defaultValue={question.unspecifiedPart ?? ""} rows={3} />}
      </Field> : <>
        <Field label="Evidence sentence" name="evidenceSentence" error={save.error}>{(props) => <textarea {...props} ref={evidence} defaultValue={question.evidenceSentence ?? ""} rows={3} />}</Field>
        <Button type="button" variant="outline" className="w-fit" aria-expanded={showSource} onClick={() => { setShowSource(!showSource); setSelectionError(false); }}>{showSource ? "Hide passage text" : "Pick evidence from passage"}</Button>
        {showSource && <div className="space-y-2 rounded-xl border bg-passage p-3">
          <Field label="Select evidence in the saved text" name="passageSource">{(props) => <textarea {...props} ref={source} value={body} readOnly rows={6} />}</Field>
          <Button type="button" variant="outline" onClick={setEvidence}>Use selection as evidence</Button>
          {selectionError && <p role="alert" className="text-sm text-destructive">Select text from the passage first.</p>}
        </div>}
      </>}
      <Field label="Misleading sentence (optional)" name="misleadingSentence" error={save.error}>{(props) => <textarea {...props} defaultValue={question.misleadingSentence ?? ""} rows={2} />}</Field>
    </fieldset>
    <EditorFeedback error={save.error} fields={explanationFields} />
    <SaveButton pending={save.isPending} disabled={busy}>Save explanation</SaveButton>
  </form>;
}
