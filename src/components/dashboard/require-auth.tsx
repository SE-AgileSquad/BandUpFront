"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";
import { PageSkeleton } from "./page-skeleton";

export function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isLoading || isAuthenticated) return;
        const target = pathname + window.location.search;
        router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(target)}`);
    }, [isLoading, isAuthenticated, pathname, router]);

    if (isLoading || !isAuthenticated) return <PageSkeleton />;

    return <>{children}</>;
}