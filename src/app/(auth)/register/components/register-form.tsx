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
import { PasswordInput } from "@/components/auth/password-input";
import { StatusNotice } from "@/components/auth/status-notice";
import { ROUTES } from "@/constants/routes";
import { normalizeEmail } from "@/lib/email";
import { ApiError } from "@/types/api";
import { useRegisterMutation, useSendRegisterCodeMutation } from "../api/register.queries";
import { REGISTER_COPY } from "../constants/register";
import { useRegisterFlow, useRegisterFlowReady } from "../hooks/use-register-flow";
import {
    registerSchema,
    type RegisterFormValues,
} from "../schemas/register.schema";
import type { FieldErrors } from "../types";
import { TermsField } from "./terms-field";

const defaultValues: RegisterFormValues = {
    displayName: "",
    email: "",
    password: "",
    captchaToken: null,
    acceptedTerms: false,
};

const FIELD_NAMES = Object.keys(defaultValues) as (keyof RegisterFormValues)[];

export function RegisterForm() {
    const router = useRouter();
    const ready = useRegisterFlowReady();
    const startVerification = useRegisterFlow((state) => state.startVerification);
    const mutation = useRegisterMutation();
    const sendCode = useSendRegisterCodeMutation();
    const [emailTaken, setEmailTaken] = useState(false);
    const [generalError, setGeneralError] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        setError,
        setValue,
        getValues,
        formState: { errors, isSubmitted },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues,
    });

    useEffect(() => {
        if (!ready) return;
        const session = useRegisterFlow.getState().session;
        if (!session || getValues("displayName") || getValues("email")) return;
        setValue("displayName", session.displayName);
        setValue("email", session.email);
    }, [ready, getValues, setValue]);

    const hasErrors = Object.keys(errors).length > 0;
    const submitDisabled = mutation.isPending || sendCode.isPending || (isSubmitted && hasErrors);

    const onSubmit = handleSubmit(async (values) => {
        setEmailTaken(false);
        setGeneralError(false);

        const email = normalizeEmail(values.email);
        if (!email) {
            setError("email", { message: REGISTER_COPY.errors.email }, { shouldFocus: true });
            return;
        }

        try {
            const displayName = values.displayName.trim();
            const user = await mutation.mutateAsync({
                email,
                password: values.password,
                displayName,
                captchaToken: values.captchaToken ?? "",
            });

            const response = await sendCode.mutateAsync({ email, displayName });

            startVerification({
                verificationId: response.verificationId,
                email,
                maskedEmail: response.maskedEmail,
                displayName,
                user,
                expiresAt: Date.parse(response.expiresAt),
                resendAvailableAt: Date.parse(response.resendAvailableAt),
                lockedUntil: null,
            });
            router.push(ROUTES.REGISTER_VERIFY);
        } catch (error) {
            setValue("captchaToken", null);
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    setEmailTaken(true);
                    return;
                }

                if (error.status === 422) {
                    const fieldErrors =
                        (error.details as { fieldErrors?: FieldErrors } | undefined)
                            ?.fieldErrors ?? {};
                    let mapped = false;
                    for (const [key, raw] of Object.entries(fieldErrors)) {
                        if (!FIELD_NAMES.includes(key as keyof RegisterFormValues)) continue;
                        const message = Array.isArray(raw) ? raw[0] : raw;
                        setError(
                            key as keyof RegisterFormValues,
                            { type: "server", message },
                            { shouldFocus: !mapped },
                        );
                        mapped = true;
                    }
                    if (mapped) return;
                }
            }
            setGeneralError(true);
        }
    });

    const { fields } = REGISTER_COPY;

    return (
        <>
            <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-[14px] lg:gap-[18px]"
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-auth-title">{REGISTER_COPY.title}</h1>
                    <p className="text-[15px] leading-[22px] text-muted-foreground">
                        {REGISTER_COPY.subtitle}
                    </p>
                </div>

                <FormField label={fields.displayName.label} error={errors.displayName?.message}>
                    <FieldInput
                        placeholder={fields.displayName.placeholder}
                        autoComplete="name"
                        {...register("displayName")}
                    />
                </FormField>

                <FormField label={fields.email.label} error={errors.email?.message}>
                    <FieldInput
                        type="email"
                        inputMode="email"
                        placeholder={fields.email.placeholder}
                        autoComplete="email"
                        {...register("email", { onChange: () => setEmailTaken(false) })}
                    />
                </FormField>

                <FormField
                    label={fields.password.label}
                    helper={fields.password.helper}
                    error={errors.password?.message}
                >
                    <PasswordInput
                        placeholder={fields.password.placeholder}
                        {...register("password")}
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

                <TermsField
                    error={errors.acceptedTerms?.message}
                    {...register("acceptedTerms")}
                />

                {emailTaken && (
                    <StatusNotice
                        variant="error"
                        title={REGISTER_COPY.emailTaken.title}
                        description={REGISTER_COPY.emailTaken.description}
                    />
                )}
                {generalError && (
                    <StatusNotice
                        variant="error"
                        title={REGISTER_COPY.generalError.title}
                        description={REGISTER_COPY.generalError.description}
                    />
                )}

                <Button
                    type="submit"
                    variant="gradient"
                    size="default"
                    className="w-full"
                    disabled={submitDisabled}
                    aria-busy={mutation.isPending || sendCode.isPending}
                >
                    {mutation.isPending || sendCode.isPending ? (
                        <>
                            <Loader2 aria-hidden className="size-5 animate-spin" />
                            {REGISTER_COPY.submitting}
                        </>
                    ) : (
                        REGISTER_COPY.submit
                    )}
                </Button>

                {emailTaken && (
                    <>
                        <Button asChild variant="brand-outline" size="default" className="w-full">
                            <Link href={ROUTES.LOGIN}>{REGISTER_COPY.emailTaken.signIn}</Link>
                        </Button>
                        <Link
                            href={ROUTES.FORGOT_PASSWORD}
                            className="self-center rounded-sm text-[15px] leading-[22px] font-medium text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
                        >
                            {REGISTER_COPY.emailTaken.reset}
                        </Link>
                    </>
                )}
            </form>

            {!emailTaken && (
                <p className="flex items-center justify-center gap-1.5 text-[14px] leading-[21px]">
                    <span className="text-muted-foreground">
                        {REGISTER_COPY.login.prompt}
                    </span>
                    <Link
                        href={ROUTES.LOGIN}
                        className="rounded-sm font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
                    >
                        {REGISTER_COPY.login.link}
                    </Link>
                </p>
            )}
        </>
    );
}
