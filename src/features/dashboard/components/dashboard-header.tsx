"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import ThemeSwitch from "@/components/ThemeSwitch";
import { cn } from "@/lib/utils";
import { READING_TEST_PATH } from "../constants/dashboard.constants";
import { getPageTitle } from "../utils/get-page-title";
import { CreditBadge } from "./credit-badge";
import { HeaderSearch } from "./header-search";

export function DashboardHeader() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-30 hidden h-[72px] items-center justify-between border-b border-border bg-background px-8 lg:flex">
            <p className="text-lead font-semibold text-foreground">
                {getPageTitle(pathname)}
            </p>
            <div className="flex items-center gap-3">
                <HeaderSearch />
                <CreditBadge />
                <ThemeSwitch />
                <Link href={READING_TEST_PATH} className={cn(buttonVariants(), "h-10 text-body text-primary-foreground")}>
                    Start a Reading test
                </Link>
            </div>
        </header>
    );
}