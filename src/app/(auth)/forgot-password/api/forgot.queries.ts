"use client";

import { useMutation } from "@tanstack/react-query";
import { forgotApi } from "./index";
import type { ResendCodePayload, ResetPayload, SendCodePayload } from "../types";

export const queryKeys = {
    send: ["auth", "password", "forgot"] as const,
    resend: ["auth", "password", "forgot", "resend"] as const,
    reset: ["auth", "password", "reset"] as const,
};

export function useSendResetCodeMutation() {
    return useMutation({
        mutationKey: queryKeys.send,
        mutationFn: (payload: SendCodePayload) => forgotApi.sendCode(payload),
    });
}

export function useResendResetCodeMutation() {
    return useMutation({
        mutationKey: queryKeys.resend,
        mutationFn: (payload: ResendCodePayload) => forgotApi.resendCode(payload),
    });
}

export function useResetPasswordMutation() {
    return useMutation({
        mutationKey: queryKeys.reset,
        retry: 0,
        mutationFn: (payload: ResetPayload) => forgotApi.reset(payload),
    });
}