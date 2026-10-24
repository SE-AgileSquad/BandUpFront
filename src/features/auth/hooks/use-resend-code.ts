"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resendVerificationCode } from "../api/auth.api";
import {
    DEFAULT_RATE_LIMIT_SECONDS,
    RESENT_TOAST_MESSAGE,
} from "../constants/auth.constants";
import { mapAuthError } from "../utils/map-auth-error";

interface ResendOptions {
    email: string;
    onCooldown: (seconds: number) => void;
    onResent: () => void;
}

export function useResendCode({ email, onCooldown, onResent }: ResendOptions) {
    const mutation = useMutation({ mutationFn: resendVerificationCode });

    const resend = () =>
        mutation.mutate(
            { email },
            {
                onSuccess: (response) => {
                    onCooldown(response.resendCooldownSeconds);
                    onResent();
                    toast.success(RESENT_TOAST_MESSAGE);
                },
                onError: (error) => {
                    const mapped = mapAuthError(error, "resend");
                    if (mapped.kind === "rate-limit") {
                        onCooldown(mapped.retryAfterSeconds ?? DEFAULT_RATE_LIMIT_SECONDS);
                    }
                    toast.error(mapped.message);
                },
            },
        );

    return { resend, isPending: mutation.isPending };
}