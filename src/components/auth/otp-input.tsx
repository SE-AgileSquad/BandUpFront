"use client";

import type { Ref } from "react";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";

type OtpInputProps = {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    status?: "default" | "error";
    disabled?: boolean;
    autoFocus?: boolean;
    "aria-label"?: string;
    ref?: Ref<HTMLInputElement>;
};

export function OtpInput({
    value,
    onChange,
    length = 5,
    status = "default",
    disabled,
    autoFocus,
    "aria-label": ariaLabel = "Verification code",
    ref,
}: OtpInputProps) {
    const isError = status === "error";

    return (
        <OTPInput
            ref={ref}
            value={value}
            onChange={onChange}
            maxLength={length}
            pattern={REGEXP_ONLY_DIGITS}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus={autoFocus}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-invalid={isError || undefined}
            containerClassName="flex gap-2.5 has-[input:disabled]:opacity-50"
            render={({ slots }) => (
                <>
                    {slots.map((slot, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative flex h-[60px] flex-1 items-center justify-center rounded-field border border-border bg-card text-[27px] font-semibold text-foreground transition-colors",
                                slot.isActive && "border-2",
                                isError
                                    ? "border-destructive"
                                    : slot.isActive && "border-primary",
                            )}
                        >
                            {slot.char}
                            {slot.hasFakeCaret && (
                                <span
                                    aria-hidden
                                    className="absolute h-7 w-0.5 animate-pulse bg-primary"
                                />
                            )}
                        </div>
                    ))}
                </>
            )}
        />
    );
}