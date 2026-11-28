"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { adminRoles, roleLabel, type UserRole } from "@/lib/admin-access";
import { SearchField, useListSearch } from "../_components/content-list";
import { Confirm, dateLabel, Empty, ErrorNotice, Field, Filters, formData, Heading, nonblank, Pagination, Panel, Pending, Pill, QueryError, value } from "../_components/ui";
import { useAdminAction, useAdminQuery, writeAdmin } from "../_lib/api";
import type { AdminUser, Page } from "../_lib/contracts";

const roles = [{ label: "All roles", value: "" }, ...adminRoles.map((role) => ({ label: roleLabel(role), value: role }))];
const accountStates = [{ label: "Active", value: "active" }, { label: "Deactivated", value: "inactive" }] as const;
const userFields = ["displayName", "email", "role", "password"];

export default function UsersPage() {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const [accountState, setAccountState] = useState<"active" | "inactive">("active");
  const { input, search, setInput } = useListSearch();
  const [position, setPosition] = useState({ page: 1, search: "" });
  const page = position.search === search ? position.page : 1;
  const query = useAdminQuery<Page<AdminUser>>("users", { page, pageSize: 4, role: role || undefined, search: search || undefined, isActive: accountState === "active" });
  const goToPage = (page: number) => setPosition({ page, search });
  return <>
    <Heading title="Users" description="Manage accounts, roles and access to BandUp." action={<AccountDialog />} art="users" />
    <Panel className="space-y-4">
      <SearchField label="Search users" placeholder="Search by name or email…" value={input} onChange={(value) => { setInput(value); goToPage(1); }} />
      <div className="flex flex-wrap justify-between gap-3">
        <Filters label="Account role" value={role} choices={roles} onChange={(role) => { setRole(role); goToPage(1); }} />
        <Filters label="Account status" value={accountState} choices={accountStates} onChange={(state) => { setAccountState(state); goToPage(1); }} />
      </div>
    </Panel>
    {query.isPending ? <Pending label="Loading users…" /> : query.isError ?
      <QueryError error={query.error} retry={() => void query.refetch()} /> : <>
        {query.data.items.length ? (
          <Panel className="overflow-hidden sm:px-5">
            <div className="lg:overflow-x-auto">
              <table className="block w-full text-left text-sm lg:table">
                <caption className="sr-only">Accounts with roles, credit balances and available actions</caption>
                <thead className="sr-only lg:not-sr-only lg:table-header-group">
                  <tr className="border-b text-xs text-muted-foreground">
                    {["Account", "Role", "Credits", "Joined", "Actions"].map((label) => <th scope="col" key={label} className="px-2 pb-3 font-semibold">{label}</th>)}
                  </tr>
                </thead>
                <tbody className="block divide-y lg:table-row-group">
                  {query.data.items.map((account) => <AccountRow key={account.id} account={account} isSelf={account.id === user?.id} />)}
                </tbody>
              </table>
            </div>
          </Panel>
        ) : <Empty title={accountState === "active" ? "No active accounts found" : "No deactivated accounts found"} description="Try another search or filter." />}
        <Pagination result={query.data} setPage={goToPage} />
      </>}
    <p className="text-sm text-muted-foreground">Credit balances are view-only. Manual adjustments are unavailable.</p>
  </>;
}

function AccountRow({ account, isSelf }: { account: AdminUser; isSelf: boolean }) {
  const deactivate = useAdminAction(() => writeAdmin("delete", `users/${account.id}`), ["users", "dashboard"], "Account deactivated.");
  return <tr className="grid grid-cols-2 gap-3 py-4 first:pt-0 last:pb-0 lg:table-row">
    <th scope="row" className="col-span-2 min-w-0 lg:max-w-72 lg:px-2 lg:py-4">
      <div className="font-semibold break-words">{account.displayName} {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}</div>
      <div className="font-normal break-all text-muted-foreground">{account.email}</div>
    </th>
    <AccountCell label="Role"><Pill tone={account.role === "User" ? "neutral" : "brand"}>{roleLabel(account.role)}</Pill></AccountCell>
    <AccountCell label="Credits">{account.creditBalance ?? "No balance"}</AccountCell>
    <AccountCell label="Joined">{dateLabel(account.createdAt)}</AccountCell>
    <td className="col-span-2 lg:px-2 lg:py-4">
      {isSelf ? <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck aria-hidden className="size-4" /> Your account is protected</span> :
        <div className="flex flex-wrap gap-2">
          <AccountDialog account={account} />
          {account.isActive && <Confirm label="Deactivate" title="Deactivate this account?" description={`${account.displayName} will lose access and be signed out. Their account history is retained.`}
            action={() => deactivate.mutateAsync()} disabled={deactivate.isPending} destructive />}
        </div>}
    </td>
  </tr>;
}

function AccountCell({ label, children }: { label: string; children: ReactNode }) {
  return <td className="grid content-start gap-1 lg:table-cell lg:px-2 lg:py-4"><span className="text-xs text-muted-foreground lg:hidden">{label}</span>{children}</td>;
}

function AccountDialog({ account }: { account?: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole | "">(account?.role ?? "");
  const save = useAdminAction(
    (input: { role: UserRole; displayName?: string; email?: string; password?: string }) =>
      account ? writeAdmin("patch", `users/${account.id}/role`, { role: input.role }) : writeAdmin("post", "users", input),
    ["users", "dashboard"], account ? "Role updated." : "Account created.", () => setOpen(false),
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    const data = formData(event);
    if (!role || save.isPending) return;
    save.mutate(account ? { role } : {
      role, displayName: value(data, "displayName"), email: value(data, "email"), password: String(data.get("password") ?? ""),
    });
  }

  return <Dialog open={open} onOpenChange={(next) => {
    if (save.isPending) return;
    if (next) { setRole(account?.role ?? ""); save.reset(); }
    setOpen(next);
  }}>
    <DialogTrigger asChild><Button variant={account ? "outline" : "default"} className={account ? "" : "h-11 rounded-xl bg-[#6341e8]"}>
      {!account && <Plus aria-hidden />}{account ? "Change role" : "New user"}
    </Button></DialogTrigger>
    <DialogContent showCloseButton={!save.isPending} className="max-h-[90dvh] overflow-auto rounded-card">
      <DialogHeader>
        <DialogTitle>{account ? "Change account role" : "Create an account"}</DialogTitle>
        <DialogDescription>{account ? `Change permissions for ${account.displayName}.` : "Choose the access level this account should have."}</DialogDescription>
      </DialogHeader>
      <form className="space-y-4" onSubmit={submit}>
        <fieldset className="grid gap-4" disabled={save.isPending}>
          {!account && <>
            <Field label="Display name" name="displayName" error={save.error}>{(props) => <input {...props} autoComplete="off" maxLength={60} required onInput={nonblank} />}</Field>
            <Field label="Email address" name="email" error={save.error}>{(props) => <input {...props} type="email" autoComplete="off" maxLength={320} required />}</Field>
            <Field label="Password" name="password" error={save.error} hint="Use 10–128 characters, including a letter and a digit.">{(props) => <input {...props}
              type="password" autoComplete="new-password" minLength={10} maxLength={128}
              pattern={"(?=.*\\p{L})(?=.*\\p{Nd}).+"} title="Include a letter and a digit." required />}</Field>
          </>}
          <Field label="Role" name="role" error={save.error}>{(props) => <select {...props} required value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
            <option value="" disabled>Select a role</option>
            {adminRoles.map((role) => <option key={role} value={role}>{roleLabel(role)}</option>)}
          </select>}</Field>
        </fieldset>
        {account && role && role !== account.role && <p className="text-sm">Change <strong>{account.displayName}</strong> to <strong>{roleLabel(role)}</strong>?</p>}
        <ErrorNotice error={save.error} omitFields={userFields} />
        <DialogFooter>
          <Button variant="outline" type="button" disabled={save.isPending} onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" className="bg-[#6341e8]" disabled={save.isPending || !role || role === account?.role}>{save.isPending ? "Saving…" : account ? "Confirm role change" : "Create account"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>;
}
