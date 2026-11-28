import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SuccessView } from "../components/success-view";
import { FORGOT_METADATA, FORGOT_PANEL } from "../constants/forgot";

export const metadata: Metadata = {
  title: { absolute: FORGOT_METADATA.success },
};

export default function ForgotPasswordSuccessPage() {
  return (
    <AuthShell headline={FORGOT_PANEL.headline} mascot={FORGOT_PANEL.mascot}>
      <SuccessView />
    </AuthShell>
  );
}