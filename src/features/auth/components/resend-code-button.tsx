"use client";

import { Loader2 } from "lucide-react";
import { RESEND_READY_ANNOUNCEMENT } from "../constants/auth.constants";
import { formatMmSs, useCountdown } from "../hooks/use-countdown";
import { useResendCode } from "../hooks/use-resend-code";

interface ResendCodeButtonProps {
    email: string;
    endsAt: number | null;
    onEndsAtChange: (endsAt: number) => void;
    onResent: () => void;
}

export function ResendCodeButton({
    email,
    endsAt,
    onEndsAtChange,
    onResent,
}: ResendCodeButtonProps) {
    const { secondsLeft, isRunning, start } = useCountdown(endsAt);
    const { resend, isPending } = useResendCode({
        email,
        onCooldown: (seconds) => onEndsAtChange(start(seconds)),
        onResent,
    });

    return (
        <div className="text-small text-muted-foreground">
            {isRunning ? (
                <span className="tabular-nums">Resend code in {formatMmSs(secondsLeft)}</span>
            ) : (
                <button
                    type="button"
                    onClick={resend}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 font-medium text-primary underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                            Sending…
                        </>
                    ) : (
                        "Resend code"
                    )}
                </button>
            )}
            <span role="status" className="sr-only">
                {isRunning ? "" : RESEND_READY_ANNOUNCEMENT}
            </span>
        </div>
    );
}