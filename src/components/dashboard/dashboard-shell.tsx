"use client";

import { usePathname } from "next/navigation";
import { DASHBOARD_COPY, isFocusRoute } from "@/constants/dashboard-nav";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { MobileTopBar } from "./mobile-top-bar";
import { Sidebar } from "./sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (isFocusRoute(pathname)) return <>{children}</>;

    return (
        <div className="min-h-screen bg-background lg:flex">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-btn focus:bg-card focus:px-4 focus:py-2 focus:text-[15px] focus:font-semibold focus:text-primary focus:ring-2 focus:ring-ring focus:outline-none"
            >
                {DASHBOARD_COPY.skipLink}
            </a>
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <MobileTopBar />
                <main
                    id="main-content"
                    tabIndex={-1}
                    className="flex min-w-0 flex-1 flex-col gap-5 px-4 py-5 pb-[calc(68px+24px+env(safe-area-inset-bottom))] outline-none lg:px-10 lg:py-9"
                >
                    {children}
                </main>
            </div>
            <MobileBottomNav />
        </div>
    );
}