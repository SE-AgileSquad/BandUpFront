"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { errorFields, errorMessage } from "../_lib/api";
import type { Page, Readiness, Status } from "../_lib/contracts";
import { AdminArt, type AdminArtName } from "./admin-art";

export function Heading({ title, description, action, back, art }: {
  title: string; description?: string; action?: ReactNode; back?: { href: string; label: string }; art?: AdminArtName;
}) {
  return (
    <header className={cn("space-y-3", art && "overflow-hidden rounded-card border bg-linear-to-br from-card via-card to-primary-soft p-4 sm:p-6")}>
      {back && <Link href={back.href} className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-accent-foreground hover:underline"><ArrowLeft aria-hidden className="size-4" />{back.label}</Link>}
      <div className={cn("gap-3", art ? "grid grid-cols-[minmax(0,1fr)_4.75rem] items-center sm:grid-cols-[minmax(0,1fr)_8rem] sm:gap-6" : "flex flex-wrap items-start justify-between")}>
        <div className="min-w-0 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight wrap-break-word sm:text-4xl">{title}</h1>
          {description && <p className="text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}
          {art && action && <div className="pt-1">{action}</div>}
        </div>
        {art ? <AdminArt name={art} sizes="(min-width: 640px) 128px, 76px" className="aspect-square w-full drop-shadow-md" /> : action}
      </div>
    </header>
  );
}

export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("min-w-0 rounded-card border bg-card p-4 shadow-sm shadow-primary/5 sm:p-6", className)} {...props} />;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "warning" | "success" }) {
  return <span className={cn("inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
    { neutral: "bg-muted text-muted-foreground", brand: "bg-primary-soft text-accent-foreground", warning: "bg-warning-soft text-warning-soft-foreground", success: "bg-success-bg text-success" }[tone])}>{children}</span>;
}

export function StatusPill({ status }: { status: Status }) {
  return <Pill tone={status === "Published" ? "success" : status === "Draft" ? "warning" : "neutral"}>{status}</Pill>;
}

export function Pending({ label = "Loading…" }: { label?: string }) {
  return <Panel className="flex items-center gap-3 text-sm text-muted-foreground"><span role="status" className="flex items-center gap-3"><LoaderCircle className="size-5 motion-safe:animate-spin text-primary" aria-hidden />{label}</span></Panel>;
}

export function Empty({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <Panel className="grid justify-items-center gap-3 py-8 text-center sm:py-10">
      <AdminArt name="empty" sizes="96px" className="h-20 w-24" />
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action}
    </Panel>
  );
}

export function ErrorNotice({ error, omitFields = [] }: { error: unknown; omitFields?: string[] }) {
  if (!error) return null;
  const messages = [...new Set(Object.entries(errorFields(error)).filter(([key]) => !omitFields.includes(key)).flatMap(([, values]) => values))];
  return <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive-bg p-3 text-sm">
    <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
    <div><p className="font-medium">{errorMessage(error)}</p>{messages.length > 0 && <ul className="mt-1 list-disc pl-4">{messages.map((message) => <li key={message}>{message}</li>)}</ul>}</div>
  </div>;
}

export function QueryError({ error, retry }: { error: unknown; retry: () => void }) {
  return <Panel className="space-y-3"><ErrorNotice error={error} /><Button variant="outline" onClick={retry}>Try again</Button></Panel>;
}

export function Field({ label, name, error, hint, children }: {
  label: string; name: string; error?: unknown; hint?: ReactNode;
  children: (attributes: { id: string; name: string; className: string; "aria-invalid": boolean; "aria-describedby"?: string }) => ReactNode;
}) {
  const id = useId();
  const messages = errorFields(error)[name];
  return <div className="grid min-w-0 gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold">{label}</label>
    {children({
      id, name,
      className: "min-h-11 w-full min-w-0 rounded-xl border bg-field px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive disabled:opacity-65",
      "aria-invalid": Boolean(messages?.length),
      "aria-describedby": hint || messages?.length ? `${id}-help` : undefined,
    })}
    {(hint || messages?.length) && <div id={`${id}-help`} className="text-xs leading-5 text-muted-foreground">
      {hint}{messages?.map((message) => <div key={message} className="font-medium text-foreground">{message}</div>)}
    </div>}
  </div>;
}

export function Filters<T extends string>({ label, value, choices, onChange }: {
  label: string; value: string; choices: readonly { value: T; label: string }[]; onChange: (value: T) => void;
}) {
  return <div role="group" aria-label={label} className="flex flex-wrap gap-2">
    {choices.map((choice) => <Button key={choice.value} aria-pressed={value === choice.value}
      className={cn("min-h-10 rounded-full px-4", value === choice.value && "bg-[#6341e8] text-white")}
      variant={value === choice.value ? "default" : "outline"} type="button" onClick={() => onChange(choice.value)}>{choice.label}</Button>)}
  </div>;
}

export function Pagination({ result, setPage }: { result: Page<unknown>; setPage: (page: number) => void }) {
  if (!result.totalCount) return null;
  const { page, pageSize, totalCount, items } = result;
  const pages = Math.ceil(totalCount / pageSize);
  return <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3">
    <p className="text-sm text-muted-foreground" aria-live="polite">
      {items.length ? `${(page - 1) * pageSize + 1}–${(page - 1) * pageSize + items.length} of ${totalCount}` : `${totalCount} results`} · Page {Math.min(page, pages)} of {pages}
    </p>
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" disabled={page <= 1} onClick={() => setPage(Math.min(page - 1, pages))}><ChevronLeft aria-hidden />Previous</Button>
      <Button variant="outline" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next<ChevronRight aria-hidden /></Button>
    </div>
  </nav>;
}

export function Confirm({ label, title, description, action, disabled, destructive }: {
  label: string; title: string; description: string; action: () => Promise<unknown>; disabled?: boolean; destructive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function confirm() {
    setPending(true);
    setError(null);
    try {
      await action();
      setOpen(false);
    } catch (error) {
      setError(error);
    } finally {
      setPending(false);
    }
  }

  return <Dialog open={open} onOpenChange={(next) => { if (!pending) { setError(null); setOpen(next); } }}>
    <DialogTrigger asChild><Button type="button" variant={destructive ? "outline" : "default"} className={destructive ? "text-destructive" : "bg-[#6341e8]"} disabled={disabled}>{label}</Button></DialogTrigger>
    <DialogContent showCloseButton={!pending} className="max-h-[90dvh] overflow-auto rounded-card">
      <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
      <ErrorNotice error={error} />
      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="button" variant={destructive ? "destructive" : "default"} className={destructive ? "bg-red-700" : "bg-[#6341e8]"} disabled={pending} onClick={() => void confirm()}>{pending ? "Working…" : label}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

export function ReadinessNotice({ readiness, fieldLink }: { readiness: Readiness; fieldLink?: (key: string) => string | undefined }) {
  if (readiness.isReady) return <p className="text-sm font-medium text-success">Ready to publish.</p>;
  return <div className="rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm text-warning-soft-foreground">
    <p className="font-semibold">Complete these steps before publishing</p>
    <ul className="mt-2 list-disc space-y-1 pl-5">
      {Object.entries(readiness.errors).flatMap(([key, values]) => values.map((message) => {
        const href = fieldLink?.(key);
        return <li key={`${key}:${message}`}>{message}{href && <> <a href={href} className="font-semibold underline">Go to field</a></>}</li>;
      }))}
    </ul>
  </div>;
}

export function SectionLinks({ sections }: { sections: ReadonlyArray<readonly [string, string]> }) {
  return <nav aria-label="Editor sections" className="flex flex-wrap gap-2">{sections.map(([id, label]) =>
    <Button key={id} variant="outline" className="rounded-full" asChild><a href={`#${id}`}>{label}</a></Button>)}</nav>;
}

export function formData(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  return new FormData(event.currentTarget);
}

export function value(data: FormData, name: string) {
  return String(data.get(name) ?? "").trim();
}

export function nonblank(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
  const field = event.currentTarget;
  field.setCustomValidity(field.value && !field.value.trim() ? "Enter a value other than spaces." : "");
}

export const intRange = { min: -2147483648, max: 2147483647, step: 1 } as const;

export function dateLabel(date: string | null) {
  return date ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(date)) : "Unknown";
}
