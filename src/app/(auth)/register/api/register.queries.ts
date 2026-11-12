"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/lib/auth-api";
import { registerApi } from "./index";
import type { RegisterPayload, ResendPayload, VerifyPayload } from "../types";

export const queryKeys = {
    me: authKeys.me,
    register: ["auth", "register"] as const,
    verify: ["auth", "register", "verify"] as const,
    resend: ["auth", "register", "resend"] as const,
};

export function useRegisterMutation() {
    return useMutation({
        mutationKey: queryKeys.register,
        mutationFn: (payload: RegisterPayload) => registerApi.register(payload),
    });
}

export function useVerifyOtpMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: queryKeys.verify,
        mutationFn: (payload: VerifyPayload) => registerApi.verify(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.me });
        },
    });
}

export function useResendOtpMutation() {
    return useMutation({
        mutationKey: queryKeys.resend,
        mutationFn: (payload: ResendPayload) => registerApi.resend(payload),
    });
}