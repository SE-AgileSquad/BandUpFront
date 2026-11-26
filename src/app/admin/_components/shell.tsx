"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, FileText, House, Menu, Network, PenLine, Shield, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { authKeys, fetchMe } from "@/lib/auth-api";
import { canAccessAdmin, roleLabel } from "@/lib/admin-access";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/dashboard/user-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pending, QueryError, Panel } from "./ui";

const navigation = [
  { href: "/admin", label: "Home", Icon: House },
  { href: "/admin/passages", label: "Passages", Icon: BookOpen },
  { href: "/admin/lessons", label: "Lessons", Icon: FileText },
  { href: "/admin/prompts", label: "Writing Prompts", Icon: PenLine },
  { href: "/admin/mapping", label: "Lesson mapping", Icon: Network },
  { href: "/admin/users", label: "Users", Icon: Users },
];

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    retry: false,
  });
  const signedOut = session.isSuccess && session.isFetchedAfterMount && !session.data;

  useEffect(() => {
    if (!signedOut) return;
    const next = pathname + window.location.search;
    router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(next)}`);
  }, [signedOut, pathname, router]);

  const usersOnly = /^\/admin\/users(?:\/|$)/.test(pathname);
  let state: React.ReactNode;
  if (session.isError) state = <QueryError error={session.error} retry={() => void session.refetch()} />;
  else if (!session.isFetchedAfterMount || signedOut) state = <Pending label="Checking your access…" />;
  else if (canAccessAdmin(session.data?.role, usersOnly)) return children;
  else state = (
    <Panel className="grid gap-4 text-center">
      <Shield aria-hidden className="mx-auto size-8 text-primary" />
      <h1 className="text-2xl font-semibold">403 · Access denied</h1>
      <p className="text-muted-foreground">{usersOnly && canAccessAdmin(session.data?.role) ? "Only a Super Admin can manage accounts." : "You don’t have access to the admin workspace."}</p>
      <Button asChild variant="outline"><Link href={canAccessAdmin(session.data?.role) ? ROUTES.ADMIN : ROUTES.DASHBOARD}>Back to {canAccessAdmin(session.data?.role) ? "admin home" : "dashboard"}</Link></Button>
    </Panel>
  );

  return <main className="mx-auto mt-16 max-w-lg px-5">{state}</main>;
}

function AdminNavigation({ role, close }: { role?: string; close?: () => void }) {
  const pathname = usePathname().replace(/\/$/, "");
  return (
    <nav aria-label="Admin navigation" className="grid gap-1">
      {navigation.filter(({ href }) => href !== "/admin/users" || canAccessAdmin(role, true)).map(({ href, label, Icon }) => {
        const active = href === pathname || (href !== "/admin" && pathname.startsWith(`${href}/`));
        return (
          <Link key={href} href={href} onClick={close} aria-current={active ? "page" : undefined}
            className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring", active ? "bg-primary-soft text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <Icon className="size-4" aria-hidden />{label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const back = <Button asChild variant="ghost" className="justify-start text-muted-foreground"><Link href={ROUTES.DASHBOARD}><ArrowLeft aria-hidden /> Back to dashboard</Link></Button>;
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[244px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
      <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:rounded-md focus:bg-card focus:p-3">Skip to content</a>
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-auto border-r bg-card p-5 lg:flex">
        <div className="grid justify-items-start gap-2 px-1"><Logo /><p className="text-xs font-medium text-muted-foreground">Admin workspace</p></div>
        <AdminNavigation role={user?.role} />
        <div className="mt-auto grid gap-2">
          {back}
          <div className="flex items-center gap-1 rounded-xl bg-primary-soft p-1">
            <UserMenu variant="sidebar" />
            <ThemeToggle />
          </div>
        </div>
      </aside>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b bg-card px-4 py-2 lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="outline" size="icon" aria-label="Open admin navigation"><Menu aria-hidden /></Button></SheetTrigger>
            <SheetContent className="gap-4 bg-card p-5">
              <SheetHeader className="p-0"><SheetTitle>Admin workspace</SheetTitle><SheetDescription>{user && `${user.displayName} · ${roleLabel(user.role)}`}</SheetDescription></SheetHeader>
              <AdminNavigation role={user?.role} close={() => setOpen(false)} />
              {back}
              <UserMenu variant="sidebar" />
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main id="admin-main" tabIndex={-1} className="mx-auto w-full min-w-0 max-w-7xl space-y-6 px-4 py-6 sm:px-7 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
