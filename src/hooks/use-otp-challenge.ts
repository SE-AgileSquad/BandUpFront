"use client";

import { useState } from "react";
import { ApiError } from "@/types/api";
import type { OtpChallenge, OtpState } from "@/types/auth";

const DEFAULT_LOCK_MS = 15 * 60_000;

type Notice = { title: string; description: string };
type Timers = { expiresAt: number; resendAvailableAt: number };
type ResendResult = { expiresAt: string; resendAvailableAt: string };

type UseOtpChallengeOptions = {
    challenge: OtpChallenge;
    verifyFn: (code: string) => Promise<unknown>;
    resendFn: () => Promise<ResendResult>;
    messages: { verify: Notice; resend: Notice };
    onLocked?: (lockedUntil: number | null) => void;
    onTimers?: (timers: Partial<Timers>) => void;
    onSuccess?: (result: unknown) => void;
};

function initialState(challenge: OtpChallenge): OtpState {
    const now = Date.now();
    if (challenge.lockedUntil && challenge.lockedUntil > now) {
        return { kind: "locked", lockedUntil: challenge.lockedUntil };
    }
    if (challenge.expiresAt <= now) return { kind: "expired" };
    return { kind: "idle" };
}

export function useOtpChallenge({
    challenge,
    verifyFn,
    resendFn,
    messages,
    onLocked,
    onTimers,
    onSuccess,
}: UseOtpChallengeOptions) {
    const [state, setState] = useState<OtpState>(() => initialState(challenge));
    const [resendAvailableAt, setResendAvailableAt] = useState(
        challenge.resendAvailableAt,
    );
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    async function verify(code: string) {
        setNotice(null);
        setIsVerifying(true);
        try {
            const result = await verifyFn(code);
            setState({ kind: "success" });
            onSuccess?.(result);
        } catch (error) {
            if (error instanceof ApiError) {
                const details = (error.details ?? {}) as {
                    attemptsRemaining?: number;
                    lockedUntil?: string;
                };

                if (error.status === 400 && error.code === "INVALID_CODE") {
                    setState({
                        kind: "wrong",
                        attemptsRemaining: details.attemptsRemaining ?? 0,
                    });
                    return;
                }
                if (error.status === 410 && error.code === "CODE_EXPIRED") {
                    setState({ kind: "expired" });
                    return;
                }
                if (error.status === 429 && error.code === "TOO_MANY_ATTEMPTS") {
                    const lockedUntil = details.lockedUntil
                        ? Date.parse(details.lockedUntil)
                        : Date.now() + DEFAULT_LOCK_MS;
                    onLocked?.(lockedUntil);
                    setState({ kind: "locked", lockedUntil });
                    return;
                }
            }
            setNotice(messages.verify);
        } finally {
            setIsVerifying(false);
        }
    }

    async function resend(): Promise<boolean> {
        setNotice(null);
        setIsResending(true);
        try {
            const response = await resendFn();
            const timers = {
                expiresAt: Date.parse(response.expiresAt),
                resendAvailableAt: Date.parse(response.resendAvailableAt),
            };
            setResendAvailableAt(timers.resendAvailableAt);
            onTimers?.(timers);
            onLocked?.(null);
            setState({ kind: "idle" });
            return true;
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.status === 429 &&
                error.code === "RESEND_TOO_SOON"
            ) {
                const next = (error.details as { resendAvailableAt?: string } | undefined)
                    ?.resendAvailableAt;
                if (next) {
                    const timestamp = Date.parse(next);
                    setResendAvailableAt(timestamp);
                    onTimers?.({ resendAvailableAt: timestamp });
                }
                return false;
            }
            setNotice(messages.resend);
            return false;
        } finally {
            setIsResending(false);
        }
    }

    function reset() {
        setState({ kind: "idle" });
        setNotice(null);
    }

    return {
        state,
        notice,
        resendAvailableAt,
        isVerifying,
        isResending,
        verify,
        resend,
        reset,
    };
}
