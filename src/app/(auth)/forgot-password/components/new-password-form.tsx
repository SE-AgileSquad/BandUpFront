"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { ROUTES } from "@/constants/routes";
import { FORGOT_COPY } from "../constants/forgot";
import { useForgotFlow, useForgotFlowReady } from "../hooks/use-forgot-flow";
import {
    newPasswordSchema,
    type NewPasswordFormValues,
} from "../schemas/forgot.schema";

function NewPasswordFields({ onLeave }: { onLeave: () => void }) {
    const router = useRouter();

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
    const submitDisabled = isSubmitted && hasErrors;

    const onSubmit = handleSubmit((values) => {
        useForgotFlow.getState().setNewPassword(values.newPassword);
        router.push(ROUTES.FORGOT_PASSWORD_VERIFY);
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

                <Button
                    type="submit"
                    variant="gradient"
                    size="default"
                    className="w-full"
                    disabled={submitDisabled}
                >
                    {copy.submit}
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
    const challenge = useForgotFlow((state) => state.challenge);
    const leaving = useRef(false);

    useEffect(() => {
        if (ready && !challenge && !leaving.current) {
            router.replace(ROUTES.FORGOT_PASSWORD);
        }
    }, [ready, challenge, router]);

    if (!ready || !challenge) return <div aria-hidden className="min-h-[360px]" />;

    return (
        <NewPasswordFields
            onLeave={() => {
                leaving.current = true;
            }}
        />
    );
}