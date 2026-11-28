"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";
import type { OtpState } from "@/types/auth";
import { OtpInput } from "./otp-input";
import { StatusNotice } from "./status-notice";

export type { OtpState };

type OtpNotice = { title: string; description: string };

type OtpVerificationProps = {
    title?: string;
    maskedEmail: string;
    codeLength?: number;
    state: OtpState;
    resendAvailableAt: number | null;
    isVerifying: boolean;
    isResending: boolean;
    notice?: OtpNotice | null;
    resendControl?: ReactNode;
    resendReady?: boolean;
    changeNumberHref: string;
    changeLabel?: string;
    onChangeTarget?: () => void;
    onVerify: (code: string) => void | Promise<void>;
    onResend: () => Promise<boolean>;
    successTitle?: string;
    successSubtitle?: string;
    noticeTitle?: string;
    noticeDescription?: string;
    redirectingLabel?: string;
};

const IDLE: OtpState = { kind: "idle" };

function Timer({ value }: { value: string }) {
    return <span aria-hidden> · {value}</span>;
}

export function OtpVerification({
    title = "Check your messages",
    maskedEmail,
    codeLength = 5,
    state,
    resendAvailableAt,
    isVerifying,
    isResending,
    notice,
    resendControl,
    resendReady = true,
    changeNumberHref,
    changeLabel = "Change Email",
    onChangeTarget,
    onVerify,
    onResend,
    successTitle,
    successSubtitle,
    noticeTitle,
    noticeDescription,
    redirectingLabel,
}: OtpVerificationProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [code, setCode] = useState("");
    const [dismissed, setDismissed] = useState(false);
    const [prevState, setPrevState] = useState(state);

    if (state !== prevState) {
        setPrevState(state);
        setDismissed(false);
        if (state.kind === "locked") setCode("");
    }

    const lock = useCountdown(state.kind === "locked" ? state.lockedUntil : null);
    const resend = useCountdown(resendAvailableAt);

    const [wasCounting, setWasCounting] = useState(!resend.isDone);
    const [announced, setAnnounced] = useState(false);

    if (!resend.isDone && !wasCounting) {
        setWasCounting(true);
        setAnnounced(false);
    }
    if (resend.isDone && wasCounting) {
        setWasCounting(false);
        setAnnounced(true);
    }

    const effective: OtpState =
        state.kind === "locked" && lock.isDone
            ? IDLE
            : state.kind === "wrong" && dismissed
                ? IDLE
                : state;

    const locked = effective.kind === "locked";
    const expired = effective.kind === "expired";
    const success = effective.kind === "success";
    const value = locked ? "" : code;

    const canVerify =
        value.length === codeLength &&
        !isVerifying &&
        !locked &&
        !expired &&
        !success;
    const canAttemptResend = !isResending && !locked && (expired || resend.isDone);
    const canResend = canAttemptResend && resendReady;

    function handleChange(next: string) {
        setCode(next);
        if (state.kind === "wrong") setDismissed(true);
    }

    async function handleResend() {
        const ok = await onResend();
        if (ok) {
            setCode("");
            inputRef.current?.focus();
        }
    }

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (canVerify) void onVerify(value);
    }

    let resendLabel: React.ReactNode = "Resend code";
    if (locked) {
        resendLabel = (
            <span>
                Resend unavailable
                <Timer value={lock.formatted} />
            </span>
        );
    } else if (!expired && !resend.isDone) {
        resendLabel = (
            <span>
                Resend code
                <Timer value={resend.formatted} />
            </span>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-[14px] lg:gap-[18px]"
        >
            <div className="flex flex-col gap-2">
                <h1 className="text-auth-title">
                    {success ? (successTitle ?? title) : title}
                </h1>
                <p className="text-[15px] leading-[22px] text-muted-foreground">
                    {success
                        ? successSubtitle
                        : `Enter the ${codeLength}-digit code to continue.`}
                </p>
            </div>

            <p className="text-[14px] leading-[21px] font-semibold">
                Code sent to {maskedEmail}
            </p>

            <OtpInput
                ref={inputRef}
                value={value}
                onChange={handleChange}
                length={codeLength}
                status={effective.kind === "idle" || success ? "default" : "error"}
                disabled={locked || success}
                autoFocus
            />

            {effective.kind === "wrong" && (
                <StatusNotice
                    variant="error"
                    title="That code isn’t right"
                    description={
                        effective.attemptsRemaining === undefined
                            ? `Check all ${codeLength} digits and try again.`
                            : `Check all ${codeLength} digits and try again. ${effective.attemptsRemaining} ${effective.attemptsRemaining === 1 ? "attempt" : "attempts"} remaining.`
                    }
                />
            )}
            {expired && (
                <StatusNotice
                    variant="error"
                    title="Your code has expired"
                    description="Request a new code. This code can no longer be verified."
                />
            )}
            {locked && (
                <StatusNotice
                    variant="error"
                    title="Too many attempts"
                    description="Verification is locked. Try again in 15 minutes. Your email address has been kept."
                />
            )}
            {notice && (
                <StatusNotice
                    variant="error"
                    title={notice.title}
                    description={notice.description}
                />
            )}
            {success && (
                <StatusNotice
                    variant="success"
                    title={noticeTitle ?? ""}
                    description={noticeDescription ?? ""}
                />
            )}

            {success ? (
                <p
                    role="status"
                    className="flex items-center justify-center gap-2 text-[14px] leading-[21px] text-muted-foreground"
                >
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                    {redirectingLabel}
                </p>
            ) : (
                <>
                    <Button
                        type="submit"
                        variant="gradient"
                        size="default"
                        className="w-full"
                        disabled={!canVerify}
                        aria-busy={isVerifying}
                    >
                        {isVerifying && <Loader2 aria-hidden className="size-5 animate-spin" />}
                        Verify code
                    </Button>

                    {resendControl && canAttemptResend && resendControl}

                    <Button
                        type="button"
                        variant="brand-outline"
                        size="default"
                        className="w-full"
                        disabled={!canResend}
                        onClick={handleResend}
                    >
                        {isResending && <Loader2 aria-hidden className="size-5 animate-spin" />}
                        {resendLabel}
                    </Button>

                    <Link
                        href={changeNumberHref}
                        onClick={onChangeTarget}
                        className="self-center rounded-sm text-[14px] leading-[21px] font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
                    >
                        {changeLabel}
                    </Link>
                </>
            )}

            <p aria-live="polite" className="sr-only">
                {announced ? "You can request a new code" : ""}
            </p>
        </form>
    );
}
