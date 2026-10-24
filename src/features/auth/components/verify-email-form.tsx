"use client";

import { Loader2 } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { OTP_LENGTH } from "../constants/auth.constants";
import { AUTH_MESSAGE_CLASSNAME, AUTH_SUBMIT_CLASSNAME } from "../constants/auth.styles";
import { useVerifyEmailForm } from "../hooks/use-verify-email-form";
import { FormAlert } from "./form-alert";
import { ResendCodeButton } from "./resend-code-button";

interface VerifyEmailFormProps {
    email: string;
    resendEndsAt: number | null;
    onResendEndsAtChange: (endsAt: number) => void;
    onVerified: () => void;
    onChangeEmail: () => void;
}

const SLOT_INDEXES = Array.from({ length: OTP_LENGTH }, (_, index) => index);
const ERROR_ID = "verify-email-error";

export function VerifyEmailForm({
    email,
    resendEndsAt,
    onResendEndsAtChange,
    onVerified,
    onChangeEmail,
}: VerifyEmailFormProps) {
    const { form, errorMessage, isPending, isCodeComplete, onSubmit, handleResent } =
        useVerifyEmailForm({ email, onVerified });

    return (
        <div className="flex flex-col gap-6">
            <Form {...form}>
                <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
                    {errorMessage && (
                        <FormAlert variant="error" id={ERROR_ID}>
                            {errorMessage}
                        </FormAlert>
                    )}

                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field, fieldState }) => {
                            const hasError = Boolean(errorMessage) || Boolean(fieldState.error);

                            return (
                                <FormItem className="items-center">
                                    <FormLabel className="sr-only">Verification code</FormLabel>
                                    <FormControl>
                                        <InputOTP
                                            {...field}
                                            maxLength={OTP_LENGTH}
                                            pattern={REGEXP_ONLY_DIGITS}
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            autoFocus
                                            containerClassName="justify-center"
                                            aria-describedby={errorMessage ? ERROR_ID : undefined}
                                            onComplete={() => void onSubmit()}
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
                                    </FormControl>
                                    <FormMessage className={AUTH_MESSAGE_CLASSNAME} />
                                </FormItem>
                            );
                        }}
                    />

                    <Button
                        type="submit"
                        disabled={!isCodeComplete || isPending}
                        className={AUTH_SUBMIT_CLASSNAME}
                    >
                        {isPending && <Loader2 className="animate-spin" aria-hidden="true" />}
                        Verify email
                    </Button>
                </form>
            </Form>

            <div className="flex flex-col items-center gap-2 text-small">
                <ResendCodeButton
                    email={email}
                    endsAt={resendEndsAt}
                    onEndsAtChange={onResendEndsAtChange}
                    onResent={handleResent}
                />
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