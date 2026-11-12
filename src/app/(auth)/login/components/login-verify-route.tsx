"use client";

import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { sanitizeNextPath } from "@/lib/safe-redirect";
import { LOGIN_PANEL } from "../constants/login";
import { VerifyView } from "./verify-view";

export function LoginVerifyRoute() {
    const searchParams = useSearchParams();
    const next = sanitizeNextPath(searchParams.get("next"));

    return (
        <AuthShell headline={LOGIN_PANEL.headline} mascot={LOGIN_PANEL.mascot}>
            <VerifyView next={next} />
        </AuthShell>
    );
}
