"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    OtpVerification,
    type OtpState,
} from "@/components/auth/otp-verification";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/types/api";
import {
    useResendOtpMutation,
    useVerifyOtpMutation,
} from "../api/register.queries";
import { REGISTER_LIMITS, VERIFY_COPY } from "../constants/register";
import { useRegisterFlow, useRegisterFlowReady } from "../hooks/use-register-flow";
import type { VerificationSession } from "../types";

type Notice = { title: string; description: string };

function initialOtpState(session: VerificationSession): OtpState {
    const now = Date.now();
    if (session.lockedUntil && session.lockedUntil > now) {
        return { kind: "locked", lockedUntil: session.lockedUntil };
    }
    if (session.expiresAt <= now) return { kind: "expired" };
    return { kind: "idle" };
}

function VerifyContent({ session }: { session: VerificationSession }) {
    const router = useRouter();
    const verify = useVerifyOtpMutation();
    const resend = useResendOtpMutation();
    const { updateTimers, setLockedUntil, markVerified } = useRegisterFlow.getState();
    const [state, setState] = useState<OtpState>(() => initialOtpState(session));
    const [notice, setNotice] = useState<Notice | null>(null);

    async function handleVerify(code: string) {
        setNotice(null);
        try {
            await verify.mutateAsync({ verificationId: session.verificationId, code });
            markVerified();
            router.replace(ROUTES.REGISTER_SUCCESS);
        } catch (error) {
            if (error instanceof ApiError) {
                const details = (error.details ?? {}) as {
                    attemptsRemaining?: number;
                    lockedUntil?: string;
                };

                if (error.status === 400 && error.code === "INVALID_CODE") {
                    setState({ kind: "wrong", attemptsRemaining: details.attemptsRemaining ?? 0 });
                    return;
                }
                if (error.status === 410 && error.code === "CODE_EXPIRED") {
                    setState({ kind: "expired" });
                    return;
                }
                if (error.status === 429 && error.code === "TOO_MANY_ATTEMPTS") {
                    const lockedUntil = details.lockedUntil
                        ? Date.parse(details.lockedUntil)
                        : Date.now() + REGISTER_LIMITS.lockMs;
                    setLockedUntil(lockedUntil);
                    setState({ kind: "locked", lockedUntil });
                    return;
                }
            }
            setNotice(VERIFY_COPY.verifyError);
        }
    }

    async function handleResend() {
        setNotice(null);
        try {
            const response = await resend.mutateAsync({
                verificationId: session.verificationId,
            });
            updateTimers({
                expiresAt: Date.parse(response.expiresAt),
                resendAvailableAt: Date.parse(response.resendAvailableAt),
            });
            setLockedUntil(null);
            setState({ kind: "idle" });
            return true;
        } catch (error) {
            if (error instanceof ApiError && error.status === 429 && error.code === "RESEND_TOO_SOON") {
                const next = (error.details as { resendAvailableAt?: string } | undefined)
                    ?.resendAvailableAt;
                if (next) updateTimers({ resendAvailableAt: Date.parse(next) });
                return false;
            }
            setNotice(VERIFY_COPY.resendError);
            return false;
        }
    }

    return (
        <OtpVerification
            maskedPhone={session.maskedPhone}
            codeLength={REGISTER_LIMITS.codeLength}
            state={state}
            resendAvailableAt={session.resendAvailableAt}
            isVerifying={verify.isPending}
            isResending={resend.isPending}
            notice={notice}
            changeNumberHref={ROUTES.REGISTER}
            onVerify={handleVerify}
            onResend={handleResend}
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