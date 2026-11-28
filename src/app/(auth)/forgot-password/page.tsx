import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { GuestOnly } from "@/components/auth/guest-only";
import { EmailForm } from "./components/email-form";
import { FORGOT_METADATA, FORGOT_PANEL } from "./constants/forgot";

export const metadata: Metadata = {
    title: { absolute: FORGOT_METADATA.email },
};

export default function ForgotPasswordPage() {
    return (
        <GuestOnly>
            <AuthShell headline={FORGOT_PANEL.headline} mascot={FORGOT_PANEL.mascot}>
                <EmailForm />
            </AuthShell>
        </GuestOnly>
    );
}