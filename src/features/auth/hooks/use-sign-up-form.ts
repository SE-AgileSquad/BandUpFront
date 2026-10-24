"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { CaptchaFieldHandle } from "../components/captcha-field";
import { EMAIL_EXISTS_ERROR_TYPE } from "../constants/auth.constants";
import { signUpSchema, type SignUpValues } from "../schemas/sign-up.schema";
import type {
    AuthErrorField,
    MappedAuthError,
    VerificationEntry,
} from "../types/auth.types";
import { useRegister } from "./use-register";

interface SignUpFormOptions {
    defaultValues: Pick<SignUpValues, "displayName" | "email">;
    onRegistered: (entry: VerificationEntry) => void;
}

const PASSWORD_FIELDS = ["password", "confirmPassword"] as const;
const SERVER_FIELDS: readonly AuthErrorField[] = [
    "displayName",
    "email",
    "password",
    "captchaToken",
];

export function useSignUpForm({ defaultValues, onRegistered }: SignUpFormOptions) {
    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
            confirmPassword: "",
            captchaToken: "",
            ...defaultValues,
        },
    });
    const captchaRef = useRef<CaptchaFieldHandle>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const { register, isPending } = useRegister();
    const captchaToken = form.watch("captchaToken");

    useEffect(() => {
        const subscription = form.watch((_, { name }) => {
            if (name === "password" && form.getValues("confirmPassword")) {
                void form.trigger("confirmPassword");
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const applyError = (error: MappedAuthError) => {
        captchaRef.current?.reset();

        if (error.kind === "email-exists") {
            form.setError(
                "email",
                { type: EMAIL_EXISTS_ERROR_TYPE, message: error.message },
                { shouldFocus: true },
            );
            return;
        }

        if (error.kind === "field" && error.fieldErrors) {
            const names = SERVER_FIELDS.filter((name) => error.fieldErrors?.[name]);
            names.forEach((name, index) =>
                form.setError(
                    name,
                    { type: "server", message: error.fieldErrors?.[name] },
                    { shouldFocus: index === 0 },
                ),
            );
            return;
        }

        if (error.kind === "network") {
            PASSWORD_FIELDS.forEach((name) => form.resetField(name));
        }

        setBanner(error.message);
    };

    const onSubmit = form.handleSubmit((values) => {
        setBanner(null);
        const { displayName, email, password, captchaToken: token } = values;

        register(
            { displayName, email, password, captchaToken: token },
            {
                onSuccess: (response) => {
                    PASSWORD_FIELDS.forEach((name) => form.resetField(name));
                    onRegistered({
                        email: response.email,
                        displayName,
                        cooldownSeconds: response.resendCooldownSeconds,
                    });
                },
                onError: applyError,
            },
        );
    });

    return {
        form,
        captchaRef,
        banner,
        isPending,
        hasCaptchaToken: captchaToken !== "",
        onSubmit,
    };
}