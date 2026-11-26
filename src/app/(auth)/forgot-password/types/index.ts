import type { OtpErrorCode } from "@/types/auth";

export type SendCodePayload = { email: string; captchaToken: string };

export type SendCodeResponse = {
    verificationId: string;
    maskedEmail?: string;
    codeLength: 5;
    expiresAt: string;
    resendAvailableAt: string;
};

export type ResendCodePayload = { verificationId: string };
export type ResendCodeResponse = { expiresAt: string; resendAvailableAt: string };

export type ResetPayload = {
    verificationId: string;
    code: string;
    newPassword: string;
};

export type ForgotErrorCode =
    | "CAPTCHA_INVALID"
    | "RATE_LIMITED"
    | "PASSWORD_REJECTED"
    | OtpErrorCode;

export type FieldErrors = Record<string, string | string[]>;

export type ForgotApi = {
    sendCode: (payload: SendCodePayload) => Promise<SendCodeResponse>;
    resendCode: (payload: ResendCodePayload) => Promise<ResendCodeResponse>;
    reset: (payload: ResetPayload) => Promise<void>;
};