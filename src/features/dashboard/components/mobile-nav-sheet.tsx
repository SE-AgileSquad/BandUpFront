"use client";

import { Loader2, LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { USER_MENU_ITEMS } from "../constants/user-nav";
import { useMobileNav } from "../hooks/use-mobile-nav";
import { useSignOut } from "../hooks/use-sign-out";
import { isNavItemActive } from "../utils/is-nav-item-active";
import { SidebarNav } from "./sidebar-nav";
import { SidebarNavItem } from "./sidebar-nav-item";

export function MobileNavSheet() {
    const pathname = usePathname();
    const { isOpen, setIsOpen, close } = useMobileNav();
    const { signOut, isPending } = useSignOut();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
                aria-label="Open menu"
                className="flex size-10 items-center justify-center rounded-lg border border-input outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>

            <SheetContent
                side="left"
                className="flex w-[280px] flex-col gap-6 overflow-y-auto bg-background px-4 py-5"
            >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">BandUp navigation</SheetDescription>

                <div className="pl-2 pt-1">
                    <Logo />
                </div>

                <SidebarNav label="Mobile" onNavigate={close} />

                <hr className="border-border" />

                <nav aria-label="Account" className="flex flex-col gap-1">
                    {USER_MENU_ITEMS.map((item) => (
                        <SidebarNavItem
                            key={item.key}
                            item={item}
                            isActive={isNavItemActive(pathname, item.href)}
                            onNavigate={close}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={signOut}
                        disabled={isPending}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body font-medium text-destructive outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? (
                            <Loader2 className="size-[22px] animate-spin" aria-hidden="true" />
                        ) : (
                            <LogOut className="size-[22px]" strokeWidth={1.8} aria-hidden="true" />
                        )}
                        {isPending ? "Signing out…" : "Sign out"}
                    </button>
                </nav>
            </SheetContent>
        </Sheet>
    );
}