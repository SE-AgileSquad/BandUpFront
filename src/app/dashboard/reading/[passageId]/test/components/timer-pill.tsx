import { Clock, TriangleAlert } from "lucide-react";
import { formatClock } from "@/app/dashboard/reading/_shared/lib/format-time";
import { cn } from "@/lib/utils";
import {
    NOTICE_CRITICAL_SECONDS,
    NOTICE_WARNING_SECONDS,
    TEST_COPY,
} from "../constants/test";

export function TimerPill({ seconds }: { seconds: number | null }) {
    const critical = seconds !== null && seconds <= NOTICE_CRITICAL_SECONDS;
    const warning = !critical && seconds !== null && seconds <= NOTICE_WARNING_SECONDS;
    const Icon = critical ? TriangleAlert : Clock;

    return (
        <span
            role="timer"
            aria-live="off"
            aria-label={TEST_COPY.timer.label}
            className={cn(
                "inline-flex items-center gap-1.5 rounded-pill border px-[10px] py-1 text-[12px] leading-[1.4] font-semibold tabular-nums",
                critical
                    ? "border-destructive bg-destructive-bg text-destructive"
                    : warning
                        ? "border-warning-soft-foreground bg-warning-soft text-warning-soft-foreground"
                        : "border-border bg-card text-foreground",
            )}
        >
            <Icon aria-hidden className="size-3.5" />
            {seconds === null ? "--:--" : formatClock(seconds)}
        </span>
    );
}