"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";
import { OtpInput } from "./otp-input";
import { StatusNotice } from "./status-notice";

export type OtpState =
    | { kind: "idle" }
    | { kind: "wrong"; attemptsRemaining: number }
    | { kind: "expired" }
    | { kind: "locked"; lockedUntil: number };

type OtpNotice = { title: string; description: string };

type OtpVerificationProps = {
    title?: string;
    maskedPhone: string;
    codeLength?: number;
    state: OtpState;
    resendAvailableAt: number | null;
    isVerifying: boolean;
    isResending: boolean;
    notice?: OtpNotice | null;
    changeNumberHref: string;
    onVerify: (code: string) => void | Promise<void>;
    onResend: () => Promise<boolean>;
};

const IDLE: OtpState = { kind: "idle" };

function Timer({ value }: { value: string }) {
    return <span aria-hidden> · {value}</span>;
}

export function OtpVerification({
    title = "Check your messages",
    maskedPhone,
    codeLength = 5,
    state,
    resendAvailableAt,
    isVerifying,
    isResending,
    notice,
    changeNumberHref,
    onVerify,
    onResend,
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
    const value = locked ? "" : code;

    const canVerify =
        value.length === codeLength && !isVerifying && !locked && !expired;
    const canResend = !isResending && !locked && (expired || resend.isDone);

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
                <h1 className="text-auth-title">{title}</h1>
                <p className="text-[15px] leading-[22px] text-muted-foreground">
                    Enter the {codeLength}-digit code to continue.
                </p>
            </div>

            <p className="text-[14px] leading-[21px] font-semibold">
                Code sent to {maskedPhone}
            </p>

            <OtpInput
                ref={inputRef}
                value={value}
                onChange={handleChange}
                length={codeLength}
                status={effective.kind === "idle" ? "default" : "error"}
                disabled={locked}
                autoFocus
            />

            {effective.kind === "wrong" && (
                <StatusNotice
                    variant="error"
                    title="That code isn’t right"
                    description={`Check the five digits and try again. ${effective.attemptsRemaining} ${effective.attemptsRemaining === 1 ? "attempt" : "attempts"
                        } remaining.`}
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
                    description="Verification is locked. Try again in 15 minutes. Your phone number has been kept."
                />
            )}
            {notice && (
                <StatusNotice
                    variant="error"
                    title={notice.title}
                    description={notice.description}
                />
            )}

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
                className="self-center rounded-sm text-[14px] leading-[21px] font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
            >
                Change number
            </Link>

            <p aria-live="polite" className="sr-only">
                {announced ? "You can request a new code" : ""}
            </p>
        </form>
    );
}
