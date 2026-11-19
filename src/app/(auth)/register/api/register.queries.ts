"use client";

import { useMutation } from "@tanstack/react-query";
import { authKeys } from "@/lib/auth-api";
import { registerApi } from "./index";
import type { RegisterPayload, ResendPayload, StartOtpPayload, VerifyPayload } from "../types";

export const queryKeys = {
    me: authKeys.me,
    register: ["auth", "register"] as const,
    sendCode: ["auth", "register", "email", "send"] as const,
    verify: ["auth", "register", "verify"] as const,
    resend: ["auth", "register", "resend"] as const,
};

export function useRegisterMutation() {
    return useMutation({
        mutationKey: queryKeys.register,
        mutationFn: (payload: RegisterPayload) => registerApi.register(payload),
    });
}

export function useSendRegisterCodeMutation() {
    return useMutation({
        mutationKey: queryKeys.sendCode,
        mutationFn: (payload: StartOtpPayload) => registerApi.sendCode(payload),
    });
}

export function useVerifyOtpMutation() {
    return useMutation({
        mutationKey: queryKeys.verify,
        mutationFn: (payload: VerifyPayload) => registerApi.verify(payload),
    });
}

export function useResendOtpMutation() {
    return useMutation({
        mutationKey: queryKeys.resend,
        mutationFn: (payload: ResendPayload) => registerApi.resend(payload),
    });
}
