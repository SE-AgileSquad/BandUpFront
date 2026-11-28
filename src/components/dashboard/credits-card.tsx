"use client";

import { DASHBOARD_COPY } from "@/constants/dashboard-nav";
import { useWritingCredits } from "@/hooks/use-writing-credits";
import { Coins } from "lucide-react";

const { credits } = DASHBOARD_COPY;

export function CreditsCard() {
    const { data, isPending, isError } = useWritingCredits();

    return (
        <div
            aria-busy={isPending}
            className="group relative flex flex-col gap-2 overflow-hidden rounded-btn border border-border bg-linear-to-br from-primary-soft to-card/60 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.5)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
        >
            {/* glass shine sweep */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-linear-to-r from-transparent via-white/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:animate-shine motion-reduce:hidden dark:via-white/15"
            />

            <p className="relative flex items-center gap-2 text-[13px] leading-[1.4] font-medium text-muted-foreground">
                <Coins aria-hidden className="size-4 shrink-0 text-primary" />
                {credits.title}
            </p>

            {isPending ? (
                <div aria-hidden className="relative flex flex-col gap-2">
                    <div className="h-4 w-28 animate-pulse rounded-pill bg-card" />
                    <div className="h-2 w-full animate-pulse rounded-pill bg-card" />
                </div>
            ) : isError || data === null || data === undefined ? (
                <p className="relative text-[16px] leading-[24px] font-bold text-muted-foreground">
                    {credits.unavailable}
                </p>
            ) : data > 0 ? (
                <p className="relative text-[16px] leading-[24px] font-bold text-rainbow">
                    {credits.remaining(data)}
                </p>
            ) : (
                <p className="relative text-[16px] leading-[24px] font-bold text-foreground">
                    {credits.none}
                </p>
            )}
        </div>
    );
}
