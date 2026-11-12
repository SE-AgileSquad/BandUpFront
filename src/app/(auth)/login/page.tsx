import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginRoute } from "./components/login-route";
import { LOGIN_METADATA, LOGIN_PANEL } from "./constants/login";

export const metadata: Metadata = {
    title: { absolute: LOGIN_METADATA.login },
};

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <AuthShell headline={LOGIN_PANEL.headline} mascot={LOGIN_PANEL.mascot}>
                    <div aria-hidden className="min-h-[360px]" />
                </AuthShell>
            }
        >
            <LoginRoute />
        </Suspense>
    );
}
