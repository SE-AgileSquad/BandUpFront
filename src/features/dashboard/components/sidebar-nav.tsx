"use client";

import { usePathname } from "next/navigation";
import { USER_NAV_ITEMS } from "../constants/user-nav";
import { isNavItemActive } from "../utils/is-nav-item-active";
import { SidebarNavItem } from "./sidebar-nav-item";

interface SidebarNavProps {
    label?: string;
    onNavigate?: () => void;
}

export function SidebarNav({ label = "Main", onNavigate }: SidebarNavProps) {
    const pathname = usePathname();

    return (
        <nav aria-label={label} className="flex flex-col gap-1">
            {USER_NAV_ITEMS.map((item) => (
                <SidebarNavItem
                    key={item.key}
                    item={item}
                    isActive={isNavItemActive(pathname, item.href)}
                    onNavigate={onNavigate}
                />
            ))}
        </nav>
    );
}