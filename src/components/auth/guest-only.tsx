"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { sanitizeNextPath } from "@/lib/safe-redirect";

export function GuestOnly({
    next,
    children,
}: {
    next?: string | null;
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace(sanitizeNextPath(next) ?? ROUTES.DASHBOARD);
        }
    }, [isLoading, isAuthenticated, next, router]);

    return <>{children}</>;
}