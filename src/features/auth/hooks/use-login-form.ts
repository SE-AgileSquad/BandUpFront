"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { CaptchaFieldHandle } from "../components/captcha-field";
import { DASHBOARD_PATH, REGISTER_PATH } from "../constants/auth.constants";
import { loginSchema, type LoginValues } from "../schemas/login.schema";
import type { MappedAuthError } from "../types/auth.types";
import { writeStoredFlow } from "../utils/sign-up-storage";
import { useLogin } from "./use-login";

export function useLoginForm() {
    const router = useRouter();
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: { email: "", password: "", captchaToken: "" },
    });
    const captchaRef = useRef<CaptchaFieldHandle>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const { login, isPending } = useLogin();
    const captchaToken = form.watch("captchaToken");

    const applyError = (error: MappedAuthError, email: string) => {
        captchaRef.current?.reset();

        if (error.kind === "email-not-verified") {
            writeStoredFlow({ email, resendEndsAt: Date.now() });
            router.push(REGISTER_PATH);
            return;
        }

        if (error.kind === "invalid-credentials") {
            form.resetField("password");
            requestAnimationFrame(() => form.setFocus("password"));
        }

        setBanner(error.message);
    };

    const onSubmit = form.handleSubmit((values) => {
        setBanner(null);
        login(values, {
            onSuccess: () => router.replace(DASHBOARD_PATH),
            onError: (error) => applyError(error, values.email),
        });
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