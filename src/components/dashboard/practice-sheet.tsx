"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    DASHBOARD_COPY,
    PRACTICE_ITEMS,
    isRouteActive,
} from "@/constants/dashboard-nav";
import { cn } from "@/lib/utils";

type PracticeSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function PracticeSheet({ open, onOpenChange }: PracticeSheetProps) {
    const pathname = usePathname();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="max-h-[85vh] gap-4 overflow-y-auto rounded-t-[28px] bg-background p-6 pb-[calc(24px+env(safe-area-inset-bottom))]"
            >
                <SheetHeader className="p-0">
                    <SheetTitle className="text-card-title">
                        {DASHBOARD_COPY.practice.title}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        {DASHBOARD_COPY.practice.description}
                    </SheetDescription>
                </SheetHeader>
                <nav aria-label={DASHBOARD_COPY.practiceNavLabel}>
                    <ul className="flex flex-col gap-1">
                        {PRACTICE_ITEMS.map((item) => {
                            const active = isRouteActive(pathname, item.href);
                            const Icon = item.icon;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => onOpenChange(false)}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-nav px-3.5 py-3 text-[15px] leading-[22px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                            active
                                                ? "bg-primary-soft font-semibold text-primary"
                                                : "font-medium text-foreground hover:bg-primary-soft/60",
                                        )}
                                    >
                                        <Icon aria-hidden className="size-[18px] shrink-0" strokeWidth={1.8} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
