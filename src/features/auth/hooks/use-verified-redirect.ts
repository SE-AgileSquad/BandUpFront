"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    DASHBOARD_PATH,
    VERIFIED_REDIRECT_DELAY_MS,
} from "../constants/auth.constants";

export function useVerifiedRedirect() {
    const router = useRouter();

    useEffect(() => {
        const timeoutId = window.setTimeout(
            () => router.replace(DASHBOARD_PATH),
            VERIFIED_REDIRECT_DELAY_MS,
        );
        return () => window.clearTimeout(timeoutId);
    }, [router]);
}