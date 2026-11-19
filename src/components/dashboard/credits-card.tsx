"use client";

import { DASHBOARD_COPY } from "@/constants/dashboard-nav";
import { useWritingCredits } from "@/hooks/use-writing-credits";

const { credits } = DASHBOARD_COPY;

export function CreditsCard() {
    const { data, isPending, isError } = useWritingCredits();

    return (
        <div
            aria-busy={isPending}
            className="flex flex-col gap-2 rounded-btn bg-primary-soft p-4"
        >
            <p className="text-[13px] leading-[1.4] font-medium text-muted-foreground">
                {credits.title}
            </p>

            {isPending ? (
                <div aria-hidden className="flex flex-col gap-2">
                    <div className="h-4 w-28 animate-pulse rounded-pill bg-card" />
                    <div className="h-2 w-full animate-pulse rounded-pill bg-card" />
                </div>
            ) : isError || !data ? (
                <p className="text-[16px] leading-[24px] font-bold text-muted-foreground">
                    {credits.unavailable}
                </p>
            ) : (
                <>
                    <p className="text-[16px] leading-[24px] font-bold text-foreground">
                        {data.remaining > 0 ? credits.remaining(data.remaining) : credits.none}
                    </p>
                    <div
                        role="progressbar"
                        aria-label={credits.title}
                        aria-valuemin={0}
                        aria-valuemax={data.total}
                        aria-valuenow={data.remaining}
                        className="h-2 overflow-hidden rounded-pill bg-card"
                    >
                        <div
                            className="h-full rounded-pill bg-primary"
                            style={{
                                width: `${data.total > 0
                                        ? Math.min(100, Math.max(0, (data.remaining / data.total) * 100))
                                        : 0
                                    }%`,
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}