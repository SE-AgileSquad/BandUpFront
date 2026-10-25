"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import {
    OTP_LENGTH,
    RESEND_COOLDOWN_SECONDS,
    RESEND_READY_ANNOUNCEMENT,
    RESENT_TOAST_MESSAGE,
} from "../constants/auth.constants";
import { AUTH_SUBMIT_CLASSNAME } from "../constants/auth.styles";
import { formatMmSs, useCountdown } from "../hooks/use-countdown";
import { FormAlert } from "./form-alert";

interface ResetCodeFormProps {
    isSubmitting?: boolean;
    errorMessage?: string;
    onSubmit: (code: string) => void;
    onResend: () => void;
    onChangeEmail: () => void;
}

const SLOT_INDEXES = Array.from({ length: OTP_LENGTH }, (_, index) => index);
const ERROR_ID = "reset-code-error";

export function ResetCodeForm({
    isSubmitting = false,
    errorMessage,
    onSubmit,
    onResend,
    onChangeEmail,
}: ResetCodeFormProps) {
    const [code, setCode] = useState("");
    const { secondsLeft, isRunning, start } = useCountdown();
    const hasError = Boolean(errorMessage);

    useEffect(() => {
        start(RESEND_COOLDOWN_SECONDS);
    }, [start]);

    const submit = (value: string) => {
        if (value.length === OTP_LENGTH && !isSubmitting) {
            onSubmit(value);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit(code);
    };

    const handleResend = () => {
        setCode("");
        start(RESEND_COOLDOWN_SECONDS);
        onResend();
        toast.success(RESENT_TOAST_MESSAGE);
    };

    return (
        <div className="flex flex-col gap-6">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                {errorMessage && (
                    <FormAlert variant="error" id={ERROR_ID}>
                        {errorMessage}
                    </FormAlert>
                )}

                <InputOTP
                    value={code}
                    onChange={setCode}
                    onComplete={(value: string) => submit(value)}
                    maxLength={OTP_LENGTH}
                    pattern={REGEXP_ONLY_DIGITS}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    aria-label="Verification code"
                    aria-describedby={hasError ? ERROR_ID : undefined}
                    containerClassName="justify-center"
                >
                    <InputOTPGroup className="gap-2">
                        {SLOT_INDEXES.map((index) => (
                            <InputOTPSlot
                                key={index}
                                index={index}
                                aria-invalid={hasError}
                                className={cn(
                                    "h-14 w-12 rounded-lg border text-xl font-semibold first:rounded-lg last:rounded-lg",
                                    hasError && "border-destructive",
                                )}
                            />
                        ))}
                    </InputOTPGroup>
                </InputOTP>

                <Button
                    type="submit"
                    disabled={code.length < OTP_LENGTH || isSubmitting}
                    className={AUTH_SUBMIT_CLASSNAME}
                >
                    {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
                    Verify code
                </Button>
            </form>

            <div className="flex flex-col items-center gap-2 text-small">
                <div className="text-muted-foreground">
                    {isRunning ? (
                        <span className="tabular-nums">
                            Resend code in {formatMmSs(secondsLeft)}
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="font-medium text-primary underline underline-offset-4"
                        >
                            Resend code
                        </button>
                    )}
                    <span role="status" className="sr-only">
                        {isRunning ? "" : RESEND_READY_ANNOUNCEMENT}
                    </span>
                </div>
                <p className="text-muted-foreground">
                    Wrong email?{" "}
                    <button
                        type="button"
                        onClick={onChangeEmail}
                        className="font-medium text-primary underline underline-offset-4"
                    >
                        Change it
                    </button>
                </p>
            </div>
        </div>
    );
}