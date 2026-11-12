"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaptchaField } from "@/components/auth/captcha-field";
import { FieldInput, FormField } from "@/components/auth/form-field";
import { StatusNotice } from "@/components/auth/status-notice";
import { ROUTES } from "@/constants/routes";
import { normalizeEmail } from "@/lib/email";
import { withParams } from "@/lib/safe-redirect";
import { ApiError } from "@/types/api";
import { useSendLoginCodeMutation } from "../api/login.queries";
import { LOGIN_COPY } from "../constants/login";
import { useLoginFlow } from "../hooks/use-login-flow";
import { emailLoginSchema, type EmailLoginValues } from "../schemas/login.schema";

export function EmailLoginForm({ next }: { next: string | null }) {
    const router = useRouter();
    const mutation = useSendLoginCodeMutation();
    const [generalError, setGeneralError] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitted },
    } = useForm<EmailLoginValues>({
        resolver: zodResolver(emailLoginSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            email: useLoginFlow.getState().email,
            captchaToken: null,
        },
    });

    useEffect(() => {
        const subscription = watch((values, { name }) => {
            setGeneralError(false);
            if (name === "email") useLoginFlow.getState().setEmail(values.email ?? "");
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const hasErrors = Object.keys(errors).length > 0;
    const submitDisabled = mutation.isPending || (isSubmitted && hasErrors);

    const onSubmit = handleSubmit(async (values) => {
        setGeneralError(false);

        const email = normalizeEmail(values.email);
        if (!email) {
            setError("email", { message: LOGIN_COPY.errors.email }, { shouldFocus: true });
            return;
        }

        try {
            const response = await mutation.mutateAsync({
                email,
                captchaToken: values.captchaToken ?? "",
            });

            useLoginFlow.getState().startChallenge(email, {
                verificationId: response.verificationId,
                maskedEmail: response.maskedEmail,
                expiresAt: Date.parse(response.expiresAt),
                resendAvailableAt: Date.parse(response.resendAvailableAt),
                lockedUntil: null,
            });
            router.push(withParams(ROUTES.LOGIN_VERIFY, { next }));
        } catch (error) {
            if (
                error instanceof ApiError &&
                error.status === 422 &&
                error.code === "CAPTCHA_INVALID"
            ) {
                setValue("captchaToken", null);
                setError("captchaToken", { type: "server", message: LOGIN_COPY.errors.captcha });
                return;
            }
            setGeneralError(true);
        }
    });

    const { fields } = LOGIN_COPY;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-[14px] lg:gap-[18px]"
        >
            <FormField label={fields.email.label} error={errors.email?.message}>
                <FieldInput
                    type="email"
                    inputMode="email"
                    placeholder={fields.email.placeholder}
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

            {generalError && (
                <StatusNotice
                    variant="error"
                    title={LOGIN_COPY.generalError.title}
                    description={LOGIN_COPY.generalError.description}
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
                    {LOGIN_COPY.sendingEmail}
                    </>
                ) : (
                    LOGIN_COPY.submitEmail
                )}
            </Button>
        </form>
    );
}
