"use client";

import type { ReactNode } from "react";
import { MAIN_CONTENT_ID } from "../constants/dashboard.constants";
import { useCurrentUser } from "../hooks/use-current-user";
import { BottomNav } from "./bottom-nav";
import { DashboardHeader } from "./dashboard-header";
import { DashboardLoadError } from "./dashboard-load-error";
import { DevStateSwitcher } from "./dev-state-switcher";
import { MobileTopBar } from "./mobile-top-bar";
import { Sidebar } from "./sidebar";

interface UserDashboardLayoutProps {
    children: ReactNode;
}

export function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
    const { isError, refetch } = useCurrentUser({ requireUser: true });

    return (
        <div className="min-h-dvh bg-muted lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <a
                href={`#${MAIN_CONTENT_ID}`}
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-body focus:font-medium focus:text-foreground focus:ring-2 focus:ring-ring"
            >
                Skip to content
            </a>

            <Sidebar />

            <div className="flex min-w-0 flex-col">
                <MobileTopBar />
                <DashboardHeader />
                <main
                    id={MAIN_CONTENT_ID}
                    tabIndex={-1}
                    className="px-5 pb-[calc(68px+env(safe-area-inset-bottom)+24px)] pt-6 outline-none lg:px-8 lg:pb-8 lg:pt-8"
                >
                    <div className="mx-auto w-full max-w-[1400px]">
                        {isError ? <DashboardLoadError onRetry={() => void refetch()} /> : children}
                    </div>
                </main>
            </div>

            <BottomNav />

            {process.env.NODE_ENV === "development" && <DevStateSwitcher />}
        </div>
    );
}