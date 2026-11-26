"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaptchaField } from "@/components/auth/captcha-field";
import { FieldInput, FormField } from "@/components/auth/form-field";
import { StatusNotice } from "@/components/auth/status-notice";
import { ROUTES } from "@/constants/routes";
import { ApiError } from "@/types/api";
import { useSendResetCodeMutation } from "../api/forgot.queries";
import { FORGOT_COPY } from "../constants/forgot";
import { useForgotFlow, useForgotFlowReady } from "../hooks/use-forgot-flow";
import { maskEmail } from "../lib/mask-email";
import { emailSchema, type EmailFormValues } from "../schemas/forgot.schema";

type Notice = "rateLimited" | "general" | null;

function EmailFormFields() {
    const router = useRouter();
    const mutation = useSendResetCodeMutation();
    const [notice, setNotice] = useState<Notice>(null);

    const {
        register,
        control,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitted },
    } = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: { email: useForgotFlow.getState().email, captchaToken: null },
    });

    useEffect(() => {
        const subscription = watch(() => setNotice(null));
        return () => subscription.unsubscribe();
    }, [watch]);

    const hasErrors = Object.keys(errors).length > 0;
    const submitDisabled = mutation.isPending || (isSubmitted && hasErrors);

    const onSubmit = handleSubmit(async (values) => {
        setNotice(null);

        try {
            const response = await mutation.mutateAsync({
                email: values.email,
                captchaToken: values.captchaToken ?? "",
            });

            useForgotFlow.getState().startChallenge(values.email, {
                verificationId: response.verificationId,
                maskedEmail: response.maskedEmail ?? maskEmail(values.email),
                expiresAt: Date.parse(response.expiresAt),
                resendAvailableAt: Date.parse(response.resendAvailableAt),
                lockedUntil: null,
            });
            router.push(ROUTES.FORGOT_PASSWORD_NEW);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 422 && error.code === "CAPTCHA_INVALID") {
                    setValue("captchaToken", null);
                    setError("captchaToken", {
                        type: "server",
                        message: FORGOT_COPY.email.errors.captcha,
                    });
                    return;
                }
                if (error.status === 429 && error.code === "RATE_LIMITED") {
                    setNotice("rateLimited");
                    return;
                }
            }
            setNotice("general");
        }
    });

    const copy = FORGOT_COPY.email;

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
                    label={copy.label}
                    helper={copy.helper}
                    error={errors.email?.message}
                >
                    <FieldInput
                        type="email"
                        inputMode="email"
                        placeholder={copy.placeholder}
                        autoComplete="email"
                        {...register("email")}
                    />
                </FormField>

                <Controller
                    control={control}
                    name="captchaToken"
                    render={({ field }) => (
                        <CaptchaField
                            ref={field.ref}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.captchaToken?.message}
                        />
                    )}
                />

                {notice === "rateLimited" && (
                    <StatusNotice
                        variant="error"
                        title={copy.rateLimited.title}
                        description={copy.rateLimited.description}
                    />
                )}
                {notice === "general" && (
                    <StatusNotice
                        variant="error"
                        title={copy.generalError.title}
                        description={copy.generalError.description}
                    />
                )}

                <Button
                    type="submit"
                    variant="gradient"
                    size="default"
                    className="w-full"
                    disabled={submitDisabled}
                    aria-busy={mutation.isPending}
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 aria-hidden className="size-5 animate-spin" />
                            {copy.sending}
                        </>
                    ) : (
                        copy.submit
                    )}
                </Button>
            </form>

            <Link
                href={ROUTES.LOGIN}
                className="self-center rounded-sm text-[14px] leading-[21px] font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
            >
                {copy.back}
            </Link>
        </>
    );
}

export function EmailForm() {
    const ready = useForgotFlowReady();

    if (!ready) return <div aria-hidden className="min-h-[360px]" />;

    return <EmailFormFields />;
}