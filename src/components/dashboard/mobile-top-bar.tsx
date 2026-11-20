import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "./user-menu";

export function MobileTopBar() {
    return (
        <header className="sticky top-0 z-20 flex h-[calc(56px+env(safe-area-inset-top))] items-center justify-between border-b border-border bg-background px-4 pt-[env(safe-area-inset-top)] lg:hidden">
            <Logo />
            <div className="flex items-center gap-2">
                <ThemeToggle className="size-10" />
                <UserMenu />
            </div>
        </header>
    );
}