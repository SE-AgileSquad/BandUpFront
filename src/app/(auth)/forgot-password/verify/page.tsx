import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyView } from "../components/verify-view";
import { FORGOT_METADATA, FORGOT_PANEL } from "../constants/forgot";

export const metadata: Metadata = {
    title: { absolute: FORGOT_METADATA.verify },
};

export default function ForgotPasswordVerifyPage() {
    return (
        <AuthShell headline={FORGOT_PANEL.headline} mascot={FORGOT_PANEL.mascot}>
            <VerifyView />
        </AuthShell>
    );
}