import type { BreakdownItem } from "@/app/dashboard/reading/_shared/types";
import { RESULT_COPY } from "../constants/result";

export function BreakdownCard({ items }: { items: BreakdownItem[] }) {
    return (
        <section
            aria-labelledby="breakdown-title"
            className="flex flex-col gap-4"
        >
            <h2 id="breakdown-title" className="text-[20px] leading-7 font-bold sm:text-[22px]">
                {RESULT_COPY.breakdownTitle}
            </h2>
            <ul className="flex flex-col gap-4">
                {items.map((item) => (
                    <li key={item.label} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-[14px] leading-5 font-medium sm:text-[15px]">{item.label}</span>
                            <span className="text-[14px] leading-5 font-bold sm:text-[15px]">
                                {item.correct} / {item.total}
                            </span>
                        </div>
                        <div
                            role="progressbar"
                            aria-label={item.label}
                            aria-valuemin={0}
                            aria-valuemax={item.total}
                            aria-valuenow={item.correct}
                            className="h-2.5 overflow-hidden rounded-pill bg-primary-soft"
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
