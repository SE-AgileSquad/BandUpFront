import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { GuestOnly } from "@/components/auth/guest-only";
import { RegisterForm } from "./components/register-form";
import { REGISTER_METADATA } from "./constants/register";

export const metadata: Metadata = {
    title: { absolute: REGISTER_METADATA.register },
};

export default function RegisterPage() {
    return (
        <GuestOnly>
            <AuthShell>
                <RegisterForm />
            </AuthShell>
        </GuestOnly>
    );
}