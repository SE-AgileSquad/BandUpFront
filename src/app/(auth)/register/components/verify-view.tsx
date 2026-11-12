"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OtpVerification } from "@/components/auth/otp-verification";
import { useOtpChallenge } from "@/hooks/use-otp-challenge";
import { ROUTES } from "@/constants/routes";
import type { OtpState } from "@/types/auth";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../api/register.queries";
import { REGISTER_LIMITS, VERIFY_COPY } from "../constants/register";
import { useRegisterFlow, useRegisterFlowReady } from "../hooks/use-register-flow";
import type { VerificationSession } from "../types";

const IDLE: OtpState = { kind: "idle" };
const MESSAGES = {
  verify: VERIFY_COPY.verifyError,
  resend: VERIFY_COPY.resendError,
};

function VerifyContent({ session }: { session: VerificationSession }) {
  const router = useRouter();
  const verify = useVerifyOtpMutation();
  const resend = useResendOtpMutation();
  const { updateTimers, setLockedUntil, markVerified } = useRegisterFlow.getState();

  const otp = useOtpChallenge({
    challenge: session,
    verifyFn: (code) =>
      verify.mutateAsync({ verificationId: session.verificationId, code }),
    resendFn: () => resend.mutateAsync({ verificationId: session.verificationId }),
    messages: MESSAGES,
    onLocked: setLockedUntil,
    onTimers: updateTimers,
    onSuccess: () => {
      markVerified();
      router.replace(ROUTES.REGISTER_SUCCESS);
    },
  });

  const succeeded = otp.state.kind === "success";

  return (
    <OtpVerification
      maskedPhone={session.maskedPhone}
      codeLength={REGISTER_LIMITS.codeLength}
      state={succeeded ? IDLE : otp.state}
      resendAvailableAt={otp.resendAvailableAt}
      isVerifying={otp.isVerifying || succeeded}
      isResending={otp.isResending}
      notice={otp.notice}
      changeNumberHref={ROUTES.REGISTER}
      onVerify={otp.verify}
      onResend={otp.resend}
    />
  );
}

export function VerifyView() {
  const router = useRouter();
  const ready = useRegisterFlowReady();
  const session = useRegisterFlow((state) => state.session);

  useEffect(() => {
    if (ready && !session) router.replace(ROUTES.REGISTER);
  }, [ready, session, router]);

  if (!ready || !session) {
    return <div aria-hidden className="min-h-[420px]" />;
  }

  return <VerifyContent session={session} />;
}