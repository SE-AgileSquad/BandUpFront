"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type AuthActionsProps = {
    stacked?: boolean;
    onNavigate?: () => void;
};

export function AuthActions({ stacked, onNavigate }: AuthActionsProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const fullWidth = stacked ? "w-full" : undefined;

    if (isLoading) {
        return (
            <div
                aria-hidden
                className={cn(
                    "h-12 animate-pulse rounded-btn bg-muted",
                    stacked ? "w-full" : "w-[228px]",
                )}
            />
        );
    }

    if (isAuthenticated) {
        return (
            <Button asChild variant="gradient" className={fullWidth}>
                <Link href={ROUTES.DASHBOARD} onClick={onNavigate}>
                    Go to dashboard
                </Link>
            </Button>
        );
    }

    return (
        <div className={cn("flex gap-3", stacked ? "flex-col" : "items-center")}>
            <Button asChild variant="brand-outline" className={fullWidth}>
                <Link href={ROUTES.LOGIN} onClick={onNavigate}>
                    Log in
                </Link>
            </Button>
            <Button asChild variant="gradient" className={fullWidth}>
                <Link href={ROUTES.REGISTER} onClick={onNavigate}>
                    Start free
                </Link>
            </Button>
        </div>
    );
}