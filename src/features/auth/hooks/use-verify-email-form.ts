"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { OTP_LENGTH } from "../constants/auth.constants";
import {
    verifyEmailSchema,
    type VerifyEmailValues,
} from "../schemas/verify-email.schema";
import { useVerifyEmail } from "./use-verify-email";

interface VerifyEmailFormOptions {
    email: string;
    onVerified: () => void;
}

export function useVerifyEmailForm({ email, onVerified }: VerifyEmailFormOptions) {
    const form = useForm<VerifyEmailValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: { code: "" },
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { verify, isPending } = useVerifyEmail();
    const code = form.watch("code");

    const clearCode = useCallback(() => {
        form.setValue("code", "");
        form.setFocus("code");
    }, [form]);

    const onSubmit = form.handleSubmit((values) => {
        if (isPending) {
            return;
        }
        setErrorMessage(null);

        verify(
            { email, code: values.code },
            {
                onSuccess: onVerified,
                onError: (error) => {
                    setErrorMessage(error.message);
                    if (error.kind === "code-invalid") {
                        clearCode();
                    }
                },
            },
        );
    });

    const handleResent = useCallback(() => {
        setErrorMessage(null);
        clearCode();
    }, [clearCode]);

    return {
        form,
        errorMessage,
        isPending,
        isCodeComplete: code.length === OTP_LENGTH,
        onSubmit,
        handleResent,
    };
}