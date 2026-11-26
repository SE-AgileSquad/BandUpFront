"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { StatusNotice } from "@/components/auth/status-notice";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/types/api";
import { useSendResetCodeMutation } from "../api/forgot.queries";
import { FORGOT_COPY, FORGOT_LIMITS } from "../constants/forgot";
import { useForgotFlow, useForgotFlowReady } from "../hooks/use-forgot-flow";
import { maskEmail } from "../lib/mask-email";
import {
    newPasswordSchema,
    type NewPasswordFormValues,
} from "../schemas/forgot.schema";

type Notice = "rateLimited" | "general" | null;

function NewPasswordFields({ email, onLeave }: { email: string; onLeave: () => void }) {
    const router = useRouter();
    const sendCode = useSendResetCodeMutation();
    const [notice, setNotice] = useState<Notice>(null);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        trigger,
        getValues,
        formState: { errors, isSubmitted },
    } = useForm<NewPasswordFormValues>({
        resolver: zodResolver(newPasswordSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: { newPassword: "", confirmPassword: "" },
    });

    useEffect(() => {
        const message = useForgotFlow.getState().passwordError;
        if (!message) return;
        setError("newPassword", { type: "server", message }, { shouldFocus: true });
        useForgotFlow.getState().setPasswordError(null);
    }, [setError]);

    const hasErrors = Object.keys(errors).length > 0;
    const submitDisabled = sendCode.isPending || (isSubmitted && hasErrors);

    const onSubmit = handleSubmit(async (values) => {
        setNotice(null);
        try {
            const response = await sendCode.mutateAsync({ email });
            const now = new Date().getTime();
            const expiresAt = response.expiresAt ? Date.parse(response.expiresAt) : Number.NaN;
            const resendAvailableAt = response.resendAvailableAt
                ? Date.parse(response.resendAvailableAt)
                : Number.NaN;
            useForgotFlow.getState().startChallenge(email, {
                maskedEmail: response.maskedEmail ?? maskEmail(email),
                expiresAt: Number.isFinite(expiresAt)
                    ? expiresAt
                    : now + FORGOT_LIMITS.codeTtlMs,
                resendAvailableAt: Number.isFinite(resendAvailableAt)
                    ? resendAvailableAt
                    : now + FORGOT_LIMITS.resendCooldownMs,
                lockedUntil: null,
            });
            useForgotFlow.getState().setNewPassword(values.newPassword);
            router.push(ROUTES.FORGOT_PASSWORD_VERIFY);
        } catch (error) {
            if (error instanceof ApiError && error.status === 429 && error.code === "RATE_LIMITED") {
                setNotice("rateLimited");
                return;
            }
            setNotice("general");
        }
    });

    const copy = FORGOT_COPY.newPassword;

    return (
        <>
            <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-[14px] lg:gap-[18px]"
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-auth-title">{copy.title}</h1>
                    <p className="text-[15px] leading-[22px] text-muted-foreground">
                        {copy.subtitle}
                    </p>
                </div>

                <FormField
                    label={copy.newLabel}
                    helper={copy.newHelper}
                    error={errors.newPassword?.message}
                >
                    <PasswordInput
                        placeholder={copy.newPlaceholder}
                        autoComplete="new-password"
                        {...register("newPassword", {
                            onChange: () => {
                                if (errors.newPassword?.type === "server") clearErrors("newPassword");
                                if (isSubmitted && getValues("confirmPassword")) {
                                    void trigger("confirmPassword");
                                }
                            },
                        })}
                    />
                </FormField>

                <FormField label={copy.confirmLabel} error={errors.confirmPassword?.message}>
                    <PasswordInput autoComplete="new-password" {...register("confirmPassword")} />
                </FormField>

                {notice === "rateLimited" && (
                    <StatusNotice
                        variant="error"
                        title={FORGOT_COPY.email.rateLimited.title}
                        description={FORGOT_COPY.email.rateLimited.description}
                    />
                )}
                {notice === "general" && (
                    <StatusNotice
                        variant="error"
                        title={FORGOT_COPY.email.generalError.title}
                        description={FORGOT_COPY.email.generalError.description}
                    />
                )}

                <Button
                    type="submit"
                    variant="gradient"
                    size="default"
                    className="w-full"
                    disabled={submitDisabled}
                    aria-busy={sendCode.isPending}
                >
                    {sendCode.isPending ? (
                        <>
                            <Loader2 aria-hidden className="size-5 animate-spin" />
                            {copy.sending}
                        </>
                    ) : copy.submit}
                </Button>
            </form>

            <Link
                href={ROUTES.LOGIN}
                onClick={() => {
                    onLeave();
                    useForgotFlow.getState().reset();
                }}
                className="self-center rounded-sm text-[14px] leading-[21px] font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
            >
                {copy.back}
            </Link>
        </>
    );
}

export function NewPasswordForm() {
    const router = useRouter();
    const ready = useForgotFlowReady();
    const email = useForgotFlow((state) => state.email);
    const leaving = useRef(false);

    useEffect(() => {
        if (ready && !email && !leaving.current) {
            router.replace(ROUTES.FORGOT_PASSWORD);
        }
    }, [ready, email, router]);

    if (!ready || !email) return <div aria-hidden className="min-h-[360px]" />;

    return (
        <NewPasswordFields
            email={email}
            onLeave={() => {
                leaving.current = true;
            }}
        />
    );
}
