import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavLinkItem } from "../constants/user-nav";

interface SidebarNavItemProps {
    item: Pick<NavLinkItem, "label" | "href" | "icon">;
    isActive: boolean;
    onNavigate?: () => void;
}

export function SidebarNavItem({ item, isActive, onNavigate }: SidebarNavItemProps) {
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
        >
            <Icon className="size-[22px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
            {item.label}
        </Link>
    );
}