"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { OtpVerification } from "@/components/auth/otp-verification";
import { useOtpChallenge } from "@/hooks/use-otp-challenge";
import { ROUTES } from "@/constants/routes";
import type { OtpState } from "@/types/auth";
import { ApiError } from "@/types/api";
import {
    useResendResetCodeMutation,
    useResetPasswordMutation,
} from "../api/forgot.queries";
import { FORGOT_COPY, FORGOT_LIMITS } from "../constants/forgot";
import {
    useForgotFlow,
    useForgotFlowReady,
    type ForgotChallenge,
} from "../hooks/use-forgot-flow";
import { maskEmail } from "../lib/mask-email";
import type { FieldErrors } from "../types";

const IDLE: OtpState = { kind: "idle" };

const MESSAGES = {
    verify: FORGOT_COPY.verify.verifyError,
    resend: FORGOT_COPY.verify.resendError,
};

function readPasswordError(details: unknown) {
    const fieldErrors = (details as { fieldErrors?: FieldErrors } | undefined)?.fieldErrors;
    const raw = fieldErrors?.newPassword;
    return Array.isArray(raw) ? raw[0] : raw;
}

type VerifyContentProps = {
    challenge: ForgotChallenge;
    email: string;
    onLeave: () => void;
};

function VerifyContent({ challenge, email, onLeave }: VerifyContentProps) {
    const router = useRouter();
    const reset = useResetPasswordMutation();
    const resend = useResendResetCodeMutation();
    const { updateTimers, setLockedUntil, setNewPassword, setPasswordError, clearChallenge, complete } =
        useForgotFlow.getState();

    const maskedTarget = challenge.maskedEmail || maskEmail(email);

    const otp = useOtpChallenge({
        challenge,
        verifyFn: async (code) => {
            const newPassword = useForgotFlow.getState().newPassword;
            if (!newPassword) {
                router.replace(ROUTES.FORGOT_PASSWORD_NEW);
                throw new Error("missing-password");
            }

            try {
                await reset.mutateAsync({
                    email,
                    code,
                    newPassword,
                });
            } catch (error) {
                if (
                    error instanceof ApiError &&
                    error.status === 422 &&
                    error.code !== "INVALID_PASSWORD_RESET_CODE"
                ) {
                    setNewPassword(null);
                    setPasswordError(
                        readPasswordError(error.details) ?? FORGOT_COPY.verify.passwordFallback,
                    );
                    router.replace(ROUTES.FORGOT_PASSWORD_NEW);
                }
                throw error;
            }
        },
        resendFn: async () => {
            const response = await resend.mutateAsync({ email });
            const now = Date.now();
            const expiresAt = response.expiresAt ? Date.parse(response.expiresAt) : Number.NaN;
            const resendAvailableAt = response.resendAvailableAt
                ? Date.parse(response.resendAvailableAt)
                : Number.NaN;
            return {
                expiresAt: new Date(
                    Number.isFinite(expiresAt) ? expiresAt : now + FORGOT_LIMITS.codeTtlMs,
                ).toISOString(),
                resendAvailableAt: new Date(
                    Number.isFinite(resendAvailableAt)
                        ? resendAvailableAt
                        : now + FORGOT_LIMITS.resendCooldownMs,
                ).toISOString(),
            };
        },
        messages: MESSAGES,
        onLocked: setLockedUntil,
        onTimers: updateTimers,
        onSuccess: () => {
            onLeave();
            complete(maskedTarget);
            router.replace(ROUTES.FORGOT_PASSWORD_SUCCESS);
        },
    });

    const succeeded = otp.state.kind === "success";

    return (
        <OtpVerification
            maskedEmail={maskedTarget}
            changeLabel={FORGOT_COPY.verify.changeLabel}
            changeNumberHref={ROUTES.FORGOT_PASSWORD}
            onChangeTarget={clearChallenge}
            codeLength={FORGOT_LIMITS.codeLength}
            state={succeeded ? IDLE : otp.state}
            resendAvailableAt={otp.resendAvailableAt}
            isVerifying={otp.isVerifying || succeeded}
            isResending={otp.isResending}
            notice={otp.notice}
            onVerify={otp.verify}
            onResend={otp.resend}
        />
    );
}

export function VerifyView() {
    const router = useRouter();
    const ready = useForgotFlowReady();
    const challenge = useForgotFlow((state) => state.challenge);
    const newPassword = useForgotFlow((state) => state.newPassword);
    const email = useForgotFlow((state) => state.email);
    const leaving = useRef(false);

    useEffect(() => {
        if (!ready || leaving.current) return;
        if (!challenge) router.replace(ROUTES.FORGOT_PASSWORD);
        else if (!newPassword) router.replace(ROUTES.FORGOT_PASSWORD_NEW);
    }, [ready, challenge, newPassword, router]);

    if (!ready || !challenge || !newPassword) {
        return <div aria-hidden className="min-h-[420px]" />;
    }

    return (
        <VerifyContent
            challenge={challenge}
            email={email}
            onLeave={() => {
                leaving.current = true;
            }}
        />
    );
}
