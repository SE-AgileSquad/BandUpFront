"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, GraduationCap, Network, PenLine, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { canAccessAdmin, roleLabel } from "@/lib/admin-access";
import { useAdminQuery } from "../_lib/api";
import type { Dashboard } from "../_lib/contracts";
import { Heading, Panel, Pending, Pill, QueryError } from "./ui";

const stats = [
  { key: "publishedPassages", label: "Published passages", Icon: BookOpen, href: "/admin/passages?status=Published" },
  { key: "draftPassages", label: "Draft passages", Icon: FileText, href: "/admin/passages?status=Draft" },
  { key: "totalLessons", label: "Lessons", Icon: GraduationCap, href: "/admin/lessons" },
  { key: "totalUsers", label: "Users", Icon: Users, href: "/admin/users" },
] as const;

export function AdminHome() {
  const { user } = useAuth();
  const counts = useAdminQuery<Dashboard>("dashboard");
  const canManageUsers = canAccessAdmin(user?.role, true);

  return <>
    <Heading title="Admin home" description="Manage BandUp’s learning content and account access."
      action={user && <Pill tone="brand">{roleLabel(user.role)}</Pill>} />
    {counts.isPending ? <Pending label="Loading dashboard…" /> : counts.isError ?
      <QueryError error={counts.error} retry={() => void counts.refetch()} /> : (
      <ul className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Dashboard totals">
        {stats.map(({ key, label, Icon, href }) => {
          const content = <><span className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground"><Icon className="size-4 text-primary" aria-hidden />{label}</span>
            <span className="mt-3 block text-3xl font-bold tabular-nums">{counts.data[key].toLocaleString("en-GB")}</span></>;
          return <li key={key} className="rounded-card border bg-card shadow-sm">{key === "totalUsers" && !canManageUsers ?
            <div className="p-4 sm:p-5">{content}</div> :
            <Link href={href} className="block rounded-card p-4 outline-none hover:bg-primary-soft/50 focus-visible:ring-2 focus-visible:ring-ring sm:p-5">{content}</Link>}
          </li>;
        })}
      </ul>
    )}
    <Panel className="relative isolate flex items-center justify-between gap-4 overflow-hidden bg-linear-to-br from-card to-primary-soft">
      <div className="relative z-10 grid justify-items-start gap-3">
        {!!counts.data?.draftPassages && <Pill tone="warning">{counts.data.draftPassages} {counts.data.draftPassages === 1 ? "draft needs" : "drafts need"} review</Pill>}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Review Reading passages</h2>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">Check answer keys and explanations before publishing passages for learners.</p>
        <Button asChild className="mt-1 h-11 rounded-xl bg-[#6341e8]"><Link href="/admin/passages?status=Draft">Review draft passages<ArrowRight aria-hidden /></Link></Button>
      </div>
      <Image src="/images/admin/books.png" width={176} height={165} alt="" className="mr-3 hidden h-auto w-32 shrink-0 drop-shadow-lg sm:block lg:w-40" />
    </Panel>
    <Panel className="space-y-4">
      <h2 className="text-xl font-semibold">Quick actions</h2>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        <Button asChild variant="outline" className="h-11 justify-start"><Link href="/admin/passages/new"><Plus aria-hidden />New passage</Link></Button>
        <Button asChild variant="outline" className="h-11 justify-start"><Link href="/admin/lessons/new"><Plus aria-hidden />New lesson</Link></Button>
        <Button asChild variant="outline" className="h-11 justify-start"><Link href="/admin/prompts"><PenLine aria-hidden />Writing Prompts</Link></Button>
        <Button asChild variant="outline" className="h-11 justify-start"><Link href="/admin/mapping"><Network aria-hidden />Lesson mapping</Link></Button>
        {canManageUsers && <Button asChild variant="outline" className="h-11 justify-start"><Link href="/admin/users"><Users aria-hidden />Manage users</Link></Button>}
      </div>
    </Panel>
  </>;
}
