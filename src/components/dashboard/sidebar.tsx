import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DASHBOARD_COPY, SIDEBAR_ITEMS } from "@/constants/dashboard-nav";
import { CreditsCard } from "./credits-card";
import { SidebarNavItem } from "./sidebar-nav-item";
import { UserMenu } from "./user-menu";

export function Sidebar() {
    return (
        <aside className="sticky top-0 hidden h-screen w-65 shrink-0 flex-col gap-1.5 overflow-y-auto border-r border-border bg-card px-5 py-6 lg:flex">
            <Logo className="self-start" />
            <div aria-hidden className="h-4 shrink-0" />
            <nav aria-label={DASHBOARD_COPY.mainNavLabel}>
                <ul className="flex flex-col gap-1.5">
                    {SIDEBAR_ITEMS.map((item) => (
                        <li key={item.href}>
                            <SidebarNavItem {...item} />
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex-1" />
            <CreditsCard />
            <div className="mt-2 flex items-center gap-2">
                <UserMenu variant="sidebar" />
                <ThemeToggle />
            </div>
        </aside>
    );
}