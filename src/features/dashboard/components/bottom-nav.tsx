"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { USER_NAV_ITEMS } from "../constants/user-nav";
import { isNavItemActive } from "../utils/is-nav-item-active";

const BOTTOM_ITEMS = USER_NAV_ITEMS.flatMap((item) =>
    item.bottomNav ? [{ ...item, label: item.bottomNav.label }] : [],
);

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Primary"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
            <ul className="grid h-[68px] grid-cols-5">
                {BOTTOM_ITEMS.map((item) => {
                    const isActive = isNavItemActive(pathname, item.href);
                    const Icon = item.icon;

                    return (
                        <li key={item.key}>
                            <Link
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                    "flex h-full flex-col items-center justify-center gap-1 text-caption outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                                    isActive ? "text-primary" : "text-muted-foreground",
                                )}
                            >
                                <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}