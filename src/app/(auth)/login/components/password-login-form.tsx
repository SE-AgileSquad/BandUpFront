"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CaptchaField } from "@/components/auth/captcha-field";
import { FieldInput, FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { StatusNotice } from "@/components/auth/status-notice";
import { ROUTES } from "@/constants/routes";
import { refreshAuth } from "@/lib/auth-api";
import { normalizeEmail } from "@/lib/email";
import { ApiError } from "@/types/api";
import { useLoginMutation } from "../api/login.queries";
import { LOGIN_COPY } from "../constants/login";
import { useLoginFlow } from "../hooks/use-login-flow";
import {
    passwordLoginSchema,
    type PasswordLoginValues,
} from "../schemas/login.schema";

type Notice = "invalid" | "general" | null;

export function PasswordLoginForm({ next }: { next: string | null }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useLoginMutation();
    const [notice, setNotice] = useState<Notice>(null);

    const {
        register,
        control,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitted },
    } = useForm<PasswordLoginValues>({
        resolver: zodResolver(passwordLoginSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            email: useLoginFlow.getState().email,
            password: "",
            captchaToken: null,
        },
    });

    useEffect(() => {
        const subscription = watch((values, { name }) => {
            setNotice(null);
            if (name === "email") useLoginFlow.getState().setEmail(values.email ?? "");
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const hasErrors = Object.keys(errors).length > 0;
    const submitDisabled = mutation.isPending || (isSubmitted && hasErrors);

    const onSubmit = handleSubmit(async (values) => {
        setNotice(null);

        const email = normalizeEmail(values.email);
        if (!email) {
            setError("email", { message: LOGIN_COPY.errors.email }, { shouldFocus: true });
            return;
        }

        try {
            await mutation.mutateAsync({
                email,
                password: values.password,
                captchaToken: values.captchaToken ?? "",
            });
            await refreshAuth(queryClient);
            useLoginFlow.getState().reset();
            router.replace(next ?? ROUTES.DASHBOARD);
        } catch (error) {
            if (error instanceof ApiError) {
                if (error.status === 401 && error.code === "INVALID_CREDENTIALS") {
                    setNotice("invalid");
                    return;
                }
                if (error.status === 422 && error.code === "CAPTCHA_INVALID") {
                    setValue("captchaToken", null);
                    setError("captchaToken", { type: "server", message: LOGIN_COPY.errors.captcha });
                    return;
                }
            }
            setNotice("general");
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
                    autoComplete="username"
                    {...register("email")}
                />
            </FormField>

            <div className="flex flex-col gap-2">
                <FormField label={fields.password.label} error={errors.password?.message}>
                    <PasswordInput
                        placeholder={fields.password.placeholder}
                        autoComplete="current-password"
                        {...register("password")}
                    />
                </FormField>
                <div className="flex justify-end">
                    <Link
                        href={ROUTES.FORGOT_PASSWORD}
                        className="rounded-sm text-[13px] leading-[1.4] font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/25"
                    >
                        {LOGIN_COPY.forgot}
                    </Link>
                </div>
            </div>

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

            {notice === "invalid" && (
                <StatusNotice
                    variant="error"
                    title={LOGIN_COPY.invalidCredentials.title}
                    description={LOGIN_COPY.invalidCredentials.description}
                />
            )}
            {notice === "general" && (
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
                        {LOGIN_COPY.submittingPassword}
                    </>
                ) : (
                    LOGIN_COPY.submitPassword
                )}
            </Button>
        </form>
    );
}
