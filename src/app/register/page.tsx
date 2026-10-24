import { AuthShell } from "@/features/auth/components/auth-shell";
import SignUpPage from "@/features/auth/components/sign-up-page";

export default function RegisterPage() {
    return (
        <AuthShell>
            <SignUpPage />
        </AuthShell>
    );
}