import { CircleAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    NOTICE_CRITICAL_SECONDS,
    NOTICE_WARNING_SECONDS,
    TEST_COPY,
} from "../constants/test";

export function TimerNotice({ seconds }: { seconds: number | null }) {
    if (seconds === null || seconds > NOTICE_WARNING_SECONDS) return null;

    const critical = seconds <= NOTICE_CRITICAL_SECONDS;
    const copy = critical ? TEST_COPY.notice.critical : TEST_COPY.notice.warning;
    const Icon = critical ? CircleAlert : Info;

    return (
        <div className="px-4 pt-4 lg:px-10">
            <div
                key={critical ? "critical" : "warning"}
                role={critical ? "alert" : "status"}
                className={cn(
                    "flex gap-3 rounded-frame border p-3",
                    critical
                        ? "border-destructive bg-destructive-bg text-destructive"
                        : "border-primary bg-primary-soft text-primary",
                )}
            >
                <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
                <div className="flex flex-col gap-0.5">
                    <p className="text-[14px] leading-[21px] font-medium">{copy.title}</p>
                    <p className="text-[13px] leading-[1.6]">{copy.text}</p>
                </div>
            </div>
        </div>
    );
}