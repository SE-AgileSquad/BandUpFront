"use client";

import { useCurrentUser } from "../hooks/use-current-user";
import { UserCardSkeleton } from "./user-card-skeleton";

export function DashboardHomePlaceholder() {
    const { user, state, isLoading } = useCurrentUser();

    if (isLoading) {
        return <UserCardSkeleton variant="greeting" />;
    }

    if (!user) {
        return null;
    }

    const firstName = user.displayName.split(" ")[0];
    const isNew = state === "new";

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-h1 font-bold text-foreground">
                    {isNew ? `Welcome to BandUp, ${firstName}` : `Hi, ${firstName}`}
                </h1>
                <p className="text-body text-muted-foreground">
                    {isNew
                        ? "Let's get you started in three simple steps."
                        : "Here's what's waiting for you today."}
                </p>
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted-foreground">
                Dashboard content goes here.
            </div>
        </div>
    );
}