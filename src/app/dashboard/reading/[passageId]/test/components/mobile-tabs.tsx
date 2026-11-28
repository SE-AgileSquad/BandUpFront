"use client";

import type { MobileTab } from "@/app/dashboard/reading/_shared/types";
import { cn } from "@/lib/utils";
import { PANEL_IDS, TEST_COPY } from "../constants/test";

type MobileTabsProps = { value: MobileTab; onChange: (tab: MobileTab) => void };

const TABS: { key: MobileTab; label: string }[] = [
    { key: "passage", label: TEST_COPY.tabs.passage },
    { key: "questions", label: TEST_COPY.tabs.questions },
];

export function MobileTabs({ value, onChange }: MobileTabsProps) {
    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        onChange(value === "passage" ? "questions" : "passage");
    }

    return (
        <div className="px-4 pt-3 lg:hidden">
            <div
                role="tablist"
                aria-label={TEST_COPY.tabs.label}
                className="flex w-full rounded-field bg-primary-soft p-1"
            >
                {TABS.map((tab) => {
                    const active = tab.key === value;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            aria-controls={PANEL_IDS[tab.key]}
                            tabIndex={active ? 0 : -1}
                            onClick={() => onChange(tab.key)}
                            onKeyDown={handleKeyDown}
                            className={cn(
                                "flex-1 rounded-[11px] py-[10px] text-[14px] leading-[21px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                active ? "bg-card text-primary" : "text-muted-foreground",
                            )}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}