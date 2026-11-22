"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isRouteActive, type NavItem } from "@/constants/dashboard-nav";
import { cn } from "@/lib/utils";

export function SidebarNavItem({ label, href, icon: Icon }: NavItem) {
    const pathname = usePathname();
    const active = isRouteActive(pathname, href);

    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
                "flex w-full items-center gap-2.5 rounded-nav px-3.5 py-[11px] text-[15px] leading-[22px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                active
                    ? "bg-primary-soft font-semibold text-primary"
                    : "font-medium text-muted-foreground hover:bg-primary-soft/60",
            )}
        >
            <Icon aria-hidden className="size-[18px] shrink-0" strokeWidth={1.8} />
            {label}
        </Link>
    );
}
