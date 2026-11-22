import type { BreakdownItem } from "@/app/dashboard/reading/_shared/types";
import { RESULT_COPY } from "../constants/result";

export function BreakdownCard({ items }: { items: BreakdownItem[] }) {
    return (
        <section
            aria-labelledby="breakdown-title"
            className="flex flex-col gap-3 rounded-card border border-border bg-card p-5"
        >
            <h2 id="breakdown-title" className="text-[16px] leading-[24px] font-bold">
                {RESULT_COPY.breakdownTitle}
            </h2>
            <ul className="flex flex-col gap-3">
                {items.map((item) => (
                    <li key={item.label} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[13px] leading-[1.4] font-medium">{item.label}</span>
                            <span className="text-[13px] leading-[1.4] font-bold">
                                {item.correct} / {item.total}
                            </span>
                        </div>
                        <div
                            role="progressbar"
                            aria-label={item.label}
                            aria-valuemin={0}
                            aria-valuemax={item.total}
                            aria-valuenow={item.correct}
                            className="h-2 overflow-hidden rounded-pill bg-primary-soft"
                        >
                            <div
                                className="h-full rounded-pill bg-primary"
                                style={{
                                    width: `${item.total > 0 ? Math.min(100, (item.correct / item.total) * 100) : 0}%`,
                                }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}