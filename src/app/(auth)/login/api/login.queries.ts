"use client";

import { useMutation } from "@tanstack/react-query";
import { authKeys } from "@/lib/auth-api";
import { loginApi } from "./index";
import type {
    LoginPayload,
    ResendCodePayload,
    SendCodePayload,
    VerifyCodePayload,
} from "../types";

export const queryKeys = {
    me: authKeys.me,
    login: ["auth", "login"] as const,
    sendCode: ["auth", "login", "sms", "send"] as const,
    verifyCode: ["auth", "login", "sms", "verify"] as const,
    resendCode: ["auth", "login", "sms", "resend"] as const,
};

export function useLoginMutation() {
    return useMutation({
        mutationKey: queryKeys.login,
        mutationFn: (payload: LoginPayload) => loginApi.login(payload),
    });
}

export function useSendLoginCodeMutation() {
    return useMutation({
        mutationKey: queryKeys.sendCode,
        mutationFn: (payload: SendCodePayload) => loginApi.sendCode(payload),
    });
}

export function useVerifyLoginCodeMutation() {
    return useMutation({
        mutationKey: queryKeys.verifyCode,
        mutationFn: (payload: VerifyCodePayload) => loginApi.verifyCode(payload),
    });
}

export function useResendLoginCodeMutation() {
    return useMutation({
        mutationKey: queryKeys.resendCode,
        mutationFn: (payload: ResendCodePayload) => loginApi.resendCode(payload),
    });
}