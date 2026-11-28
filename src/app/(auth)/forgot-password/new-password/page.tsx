import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { NewPasswordForm } from "../components/new-password-form";
import { FORGOT_METADATA, FORGOT_PANEL } from "../constants/forgot";

export const metadata: Metadata = {
    title: { absolute: FORGOT_METADATA.newPassword },
};

export default function ForgotPasswordNewPage() {
    return (
        <AuthShell headline={FORGOT_PANEL.headline} mascot={FORGOT_PANEL.mascot}>
            <NewPasswordForm />
        </AuthShell>
    );
}