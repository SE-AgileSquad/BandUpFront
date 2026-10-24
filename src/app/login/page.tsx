import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import LoginPage from "@/features/auth/components/login-page";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function Page() {
  return (
    <AuthShell>
      <LoginPage />
    </AuthShell>
  );
}