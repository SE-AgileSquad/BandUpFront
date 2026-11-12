import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SuccessView } from "../components/success-view";
import { REGISTER_METADATA } from "../constants/register";

export const metadata: Metadata = {
    title: { absolute: REGISTER_METADATA.success },
};

export default function RegisterSuccessPage() {
    return (
        <AuthShell>
            <SuccessView />
        </AuthShell>
    );
}