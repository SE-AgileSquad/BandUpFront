"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FileText, GraduationCap, Network, PenLine, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { canAccessAdmin, roleLabel } from "@/lib/admin-access";
import { useAdminQuery } from "../_lib/api";
import type { Dashboard } from "../_lib/contracts";
import { AdminArt } from "./admin-art";
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
    <Panel className="grid grid-cols-[minmax(0,1fr)_5.75rem] items-center gap-x-3 gap-y-4 overflow-hidden bg-linear-to-br from-card via-card to-primary-soft sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-x-7 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="grid min-w-0 justify-items-start gap-3 self-end">
        {!!counts.data?.draftPassages && <Pill tone="warning">{counts.data.draftPassages} {counts.data.draftPassages === 1 ? "draft needs" : "drafts need"} review</Pill>}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Review Reading passages</h2>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">Check answer keys and explanations before publishing passages for learners.</p>
      </div>
      <AdminArt name="overview" sizes="(min-width: 1024px) 272px, (min-width: 640px) 192px, 92px"
        className="col-start-2 row-start-1 aspect-square w-full mask-intersect mask-x-from-90% mask-y-from-90% drop-shadow-lg sm:row-span-2 sm:aspect-[4/3]" />
      <div className="col-span-2 self-start sm:col-span-1">
        <Button asChild className="h-11 rounded-xl bg-[#6341e8]"><Link href="/admin/passages?status=Draft">Review draft passages<ArrowRight aria-hidden /></Link></Button>
      </div>
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
