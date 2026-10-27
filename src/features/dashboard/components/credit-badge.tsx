"use client";

import { useCurrentUser } from "../hooks/use-current-user";
import { formatCredits } from "../utils/format-credits";
import { UserCardSkeleton } from "./user-card-skeleton";

export function CreditBadge() {
    const { user, isLoading } = useCurrentUser();

    if (isLoading) {
        return <UserCardSkeleton variant="badge" />;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pl-2 pr-3.5">
            <span
                aria-hidden="true"
                className="size-[18px] rounded-full border-[1.5px] border-highlight-border bg-highlight"
            />
            <span className="text-body font-medium text-foreground">
                {formatCredits(user.credits)}
            </span>
        </div>
    );
}