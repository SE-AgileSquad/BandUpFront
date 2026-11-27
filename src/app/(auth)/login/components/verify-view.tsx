"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { OtpVerification } from "@/components/auth/otp-verification";
import { CaptchaField } from "@/components/auth/captcha-field";
import { useAutoContinue } from "@/hooks/use-auto-continue";
import { useOtpChallenge } from "@/hooks/use-otp-challenge";
import { ROUTES } from "@/constants/routes";
import { authKeys, fetchMe } from "@/lib/auth-api";
import type { AuthUser } from "@/types/auth";
import { withParams } from "@/lib/safe-redirect";
import type { OtpChallenge } from "@/types/auth";
import {
    useResendLoginCodeMutation,
    useVerifyLoginCodeMutation,
} from "../api/login.queries";
import { LOGIN_LIMITS, LOGIN_VERIFY_COPY } from "../constants/login";
import { useLoginFlow, useLoginFlowReady } from "../hooks/use-login-flow";
import { readResumeInfo } from "../lib/resume-info";

const MESSAGES = {
    verify: LOGIN_VERIFY_COPY.verifyError,
    resend: LOGIN_VERIFY_COPY.resendError,
};

type VerifyContentProps = {
    challenge: OtpChallenge;
    next: string | null;
    onLeave: () => void;
};

function VerifyContent({ challenge, next, onLeave }: VerifyContentProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const verify = useVerifyLoginCodeMutation();
    const resend = useResendLoginCodeMutation();
    const email = useLoginFlow((flow) => flow.email);
    const [resendCaptchaToken, setResendCaptchaToken] = useState<string | null>(null);
    const { updateTimers, setLockedUntil } = useLoginFlow.getState();

    const hasResume = next !== null && readResumeInfo(next) !== null;
    const copy = LOGIN_VERIFY_COPY.success;

    const otp = useOtpChallenge({
        challenge,
        verifyFn: async (code) => {
            await verify.mutateAsync({ email, code });
            const user = await fetchMe();
            if (!user) throw new Error("Signed-in account could not be loaded.");
            return user;
        },
        resendFn: async () => {
            try {
                return await resend.mutateAsync({
                    email,
                    captchaToken: resendCaptchaToken ?? "",
                });
            } finally {
                setResendCaptchaToken(null);
            }
        },
        messages: MESSAGES,
        onLocked: setLockedUntil,
        onTimers: updateTimers,
        onSuccess: (result) =>
            queryClient.setQueryData(
                authKeys.me,
                result as AuthUser,
            ),
    });

    useAutoContinue(otp.state.kind === "success", async () => {
        onLeave();
        useLoginFlow.getState().reset();
        router.replace(next ?? ROUTES.DASHBOARD);
    });

    return (
        <OtpVerification
            maskedEmail={challenge.maskedEmail}
            codeLength={LOGIN_LIMITS.codeLength}
            state={otp.state}
            resendAvailableAt={otp.resendAvailableAt}
            isVerifying={otp.isVerifying}
            isResending={otp.isResending}
            notice={otp.notice}
            resendReady={Boolean(resendCaptchaToken)}
            resendControl={
                <CaptchaField
                    value={resendCaptchaToken}
                    onChange={setResendCaptchaToken}
                />
            }
            changeNumberHref={withParams(ROUTES.LOGIN, { method: "email", next })}
            onVerify={otp.verify}
            onResend={otp.resend}
            successTitle={copy.title}
            successSubtitle={hasResume ? copy.subtitleResume : copy.subtitleDefault}
            noticeTitle={copy.noticeTitle}
            noticeDescription={hasResume ? copy.noticeResume : copy.noticeDefault}
            redirectingLabel={hasResume ? copy.redirectResume : copy.redirectDefault}
        />
    );
}

export function VerifyView({ next }: { next: string | null }) {
    const router = useRouter();
    const ready = useLoginFlowReady();
    const challenge = useLoginFlow((state) => state.challenge);
    const leaving = useRef(false);

    useEffect(() => {
        if (ready && !challenge && !leaving.current) {
            router.replace(withParams(ROUTES.LOGIN, { method: "email", next }));
        }
    }, [ready, challenge, next, router]);

    if (!ready || !challenge) {
        return <div aria-hidden className="min-h-[420px]" />;
    }

    return (
        <VerifyContent
            challenge={challenge}
            next={next}
            onLeave={() => {
                leaving.current = true;
            }}
        />
    );
}
