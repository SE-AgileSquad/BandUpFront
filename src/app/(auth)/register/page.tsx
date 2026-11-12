import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "./components/register-form";
import { REGISTER_METADATA } from "./constants/register";

export const metadata: Metadata = {
    title: { absolute: REGISTER_METADATA.register },
};

export default function RegisterPage() {
    return (
        <AuthShell>
            <RegisterForm />
        </AuthShell>
    );
}