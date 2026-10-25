import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/components/auth-shell";
import ForgotPasswordPage from "@/features/auth/components/forgot-password-page";

export const metadata: Metadata = {
  title: "Forgot your password?",
};

export default function Page() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <ForgotPasswordPage />
      </Suspense>
    </AuthShell>
  );
}