"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    DASHBOARD_COPY,
    MOBILE_TABS,
    isPracticeActive,
    isRouteActive,
} from "@/constants/dashboard-nav";
import { cn } from "@/lib/utils";
import { PracticeSheet } from "./practice-sheet";

const tabClass =
    "flex w-16 flex-col items-center gap-1 rounded-nav py-1 text-[11px] leading-[14px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

export function MobileBottomNav() {
    const pathname = usePathname();
    const [practiceOpen, setPracticeOpen] = useState(false);

    return (
        <>
            <nav
                aria-label={DASHBOARD_COPY.primaryNavLabel}
                className="fixed inset-x-0 bottom-0 z-30 px-2 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:hidden"
            >
                <ul className="flex h-[68px] items-center justify-between rounded-dock border-t border-border bg-card px-4">
                    {MOBILE_TABS.map((tab) => {
                        const Icon = tab.icon;

                        if (tab.kind === "practice") {
                            const active = isPracticeActive(pathname);
                            return (
                                <li key={tab.label}>
                                    <button
                                        type="button"
                                        aria-haspopup="dialog"
                                        aria-expanded={practiceOpen}
                                        aria-current={active ? "true" : undefined}
                                        onClick={() => setPracticeOpen(true)}
                                        className={cn(
                                            tabClass,
                                            active ? "text-primary" : "text-muted-foreground",
                                        )}
                                    >
                                        <Icon aria-hidden className="size-6" />
                                        {tab.label}
                                    </button>
                                </li>
                            );
                        }

                        const active = isRouteActive(pathname, tab.href);
                        return (
                            <li key={tab.label}>
                                <Link
                                    href={tab.href}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        tabClass,
                                        active ? "text-primary" : "text-muted-foreground",
                                    )}
                                >
                                    <Icon aria-hidden className="size-6" />
                                    {tab.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <PracticeSheet open={practiceOpen} onOpenChange={setPracticeOpen} />
        </>
    );
}