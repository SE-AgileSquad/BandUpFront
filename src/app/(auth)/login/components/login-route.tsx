"use client";

import { useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { GuestOnly } from "@/components/auth/guest-only";
import { sanitizeNextPath } from "@/lib/safe-redirect";
import { LOGIN_PANEL } from "../constants/login";
import { LoginView } from "./login-view";

export function LoginRoute() {
    const searchParams = useSearchParams();
    const next = sanitizeNextPath(searchParams.get("next"));
    const reason = searchParams.get("reason") === "session-expired" ? "session-expired" : null;
    const method = searchParams.get("method") === "sms" ? "sms" : "password";

    return (
        <GuestOnly next={next}>
            <AuthShell headline={LOGIN_PANEL.headline} mascot={LOGIN_PANEL.mascot}>
                <LoginView next={next} reason={reason} method={method} />
            </AuthShell>
        </GuestOnly>
    );
}
