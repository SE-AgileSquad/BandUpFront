import type { OtpErrorCode } from "@/types/auth";

export type SendCodePayload = { email: string };

export type SendCodeResponse = {
    maskedEmail?: string;
    expiresAt?: string;
    resendAvailableAt?: string;
};

export type ResendCodePayload = { email: string };
export type ResendCodeResponse = SendCodeResponse;

export type ResetPayload = {
    email: string;
    code: string;
    newPassword: string;
};

export type ForgotErrorCode =
    | "RATE_LIMITED"
    | "PASSWORD_REJECTED"
    | "INVALID_PASSWORD_RESET_CODE"
    | OtpErrorCode;

export type FieldErrors = Record<string, string | string[]>;

export type ForgotApi = {
    sendCode: (payload: SendCodePayload) => Promise<SendCodeResponse>;
    resendCode: (payload: ResendCodePayload) => Promise<ResendCodeResponse>;
    reset: (payload: ResetPayload) => Promise<void>;
};
