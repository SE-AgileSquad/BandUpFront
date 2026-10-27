"use client";

import { ChevronDown, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { USER_MENU_ITEMS } from "../constants/user-nav";
import { useCurrentUser } from "../hooks/use-current-user";
import { useSignOut } from "../hooks/use-sign-out";
import { getInitials } from "../utils/get-initials";
import { UserCardSkeleton } from "./user-card-skeleton";

export function SidebarUserMenu() {
    const router = useRouter();
    const { user, isLoading } = useCurrentUser();
    const { signOut, isPending } = useSignOut();

    if (isLoading) {
        return <UserCardSkeleton />;
    }

    if (!user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label={`Account menu for ${user.displayName}`}
                className="flex w-full items-center gap-3 rounded-xl bg-muted p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-small font-medium text-primary-foreground">
                    {getInitials(user.displayName)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-body font-medium text-foreground">
                        {user.displayName}
                    </span>
                    <span className="truncate text-caption text-muted-foreground">
                        {user.email}
                    </span>
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </DropdownMenuTrigger>

            <DropdownMenuContent side="top" align="start" className="w-56">
                {USER_MENU_ITEMS.map((item) => (
                    <DropdownMenuItem
                        key={item.key}
                        onClick={() => router.push(item.href)}
                        className="gap-2 text-body"
                    >
                        <item.icon className="size-4" aria-hidden="true" />
                        {item.label}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={isPending}
                    onClick={(event) => {
                        event.preventDefault();
                        signOut();
                    }}
                    className="gap-2 text-body text-destructive focus:text-destructive"
                >
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <LogOut className="size-4" aria-hidden="true" />
                    )}
                    {isPending ? "Signing out…" : "Sign out"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}