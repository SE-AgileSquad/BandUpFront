"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_COPY } from "@/constants/dashboard-nav";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/hooks/use-logout";
import { cn } from "@/lib/utils";

const { userMenu } = DASHBOARD_COPY;

export function UserMenu({ variant = "avatar" }: { variant?: "sidebar" | "avatar" }) {
    const { user } = useAuth();
    const logout = useLogout();
    const sidebar = variant === "sidebar";

    if (!user) {
        return (
            <div
                aria-hidden
                className={cn(
                    "animate-pulse bg-muted",
                    sidebar ? "h-12 flex-1 rounded-nav" : "size-9 rounded-full",
                )}
            />
        );
    }

    const fullName = user.displayName;
    const initial = fullName.charAt(0).toUpperCase() || "?";
    const firstName = fullName.split(/\s+/)[0] ?? "";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label={userMenu.label}
                    className={cn(
                        "flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        sidebar
                            ? "h-12 min-w-0 flex-1 rounded-nav px-2 hover:bg-primary-soft/60"
                            : "rounded-full",
                    )}
                >
                    <span
                        aria-hidden
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-[14px] font-semibold text-primary"
                    >
                        {initial}
                    </span>
                    {sidebar && (
                        <>
                            <span className="min-w-0 flex-1 truncate text-left text-[14px] leading-[21px] font-semibold text-foreground">
                                {firstName}
                            </span>
                            <ChevronsUpDown
                                aria-hidden
                                className="size-4 shrink-0 text-muted-foreground"
                            />
                        </>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={sidebar ? "start" : "end"}
                side={sidebar ? "top" : "bottom"}
                className="min-w-52"
            >
                <DropdownMenuLabel className="truncate font-semibold">
                    {fullName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={logout.isPending}
                    onSelect={() => logout.mutate()}
                >
                    <LogOut aria-hidden className="size-4" />
                    {logout.isPending ? userMenu.loggingOut : userMenu.logOut}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}