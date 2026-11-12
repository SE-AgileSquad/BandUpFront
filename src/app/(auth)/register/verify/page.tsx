import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyView } from "../components/verify-view";
import { REGISTER_METADATA } from "../constants/register";

export const metadata: Metadata = {
    title: { absolute: REGISTER_METADATA.verify },
};

export default function RegisterVerifyPage() {
    return (
        <AuthShell>
            <VerifyView />
        </AuthShell>
    );
}