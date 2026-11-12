"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/constants/routes";

const EXEMPT_PATHS: string[] = [ROUTES.REGISTER_VERIFY, ROUTES.REGISTER_SUCCESS];

export function RedirectIfAuthenticated() {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const exempt = EXEMPT_PATHS.includes(pathname);

    useEffect(() => {
        if (isAuthenticated && !exempt) router.replace(ROUTES.DASHBOARD);
    }, [isAuthenticated, exempt, router]);

    return null;
}