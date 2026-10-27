import Logo from "@/components/Logo";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUserMenu } from "./sidebar-user-menu";

export function Sidebar() {
    return (
        <aside className="sticky top-0 hidden h-dvh flex-col justify-between border-r border-border bg-background px-4 py-5 lg:flex">
            <div className="flex flex-col gap-6">
                <div className="pl-2 pt-1">
                    <Logo />
                </div>
                <SidebarNav />
            </div>
            <SidebarUserMenu />
        </aside>
    );
}