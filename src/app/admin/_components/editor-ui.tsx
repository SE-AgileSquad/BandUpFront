"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ErrorNotice, Heading, Panel, Pending, QueryError, StatusPill } from "./ui";
import type { Status } from "../_lib/contracts";

const editorArt = {
  passage: "passages",
  lesson: "lessons",
  prompt: "writing",
  "writing prompt": "writing",
} as const;

export function EditorHeading({ resource, back, title, status, children }: {
  resource: keyof typeof editorArt; back: { href: string; label: string }; title?: string; status?: Status; children?: ReactNode;
}) {
  return <>
    <Heading title={title ?? `New ${resource}`} back={back} action={status && <StatusPill status={status} />} art={editorArt[resource]} />
    {children}
  </>;
}

export function EditorLoading({ resource, back, error, retry }: {
  resource: keyof typeof editorArt; back: { href: string; label: string }; error: unknown; retry: () => void;
}) {
  return <>
    <EditorHeading title={`View ${resource}`} resource={resource} back={back} />
    {error ? <QueryError error={error} retry={retry} /> : <Pending label={`Loading ${resource}…`} />}
  </>;
}

export function SaveButton({ pending, disabled, children }: { pending: boolean; disabled?: boolean; children: ReactNode }) {
  return <Button type="submit" className="h-11 rounded-xl bg-[#6341e8]" disabled={pending || disabled}>{pending ? "Saving…" : children}</Button>;
}

export function EditorFeedback({ error, fields, children }: { error?: unknown; fields?: string[]; children?: ReactNode }) {
  return <div className="space-y-3"><ErrorNotice error={error} omitFields={fields} />{children}</div>;
}

export function Preview({ title, text }: { title: string; text: string }) {
  return <Panel className="space-y-3 bg-passage">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="font-serif text-base leading-7 wrap-break-word whitespace-pre-wrap">{text}</p>
  </Panel>;
}
