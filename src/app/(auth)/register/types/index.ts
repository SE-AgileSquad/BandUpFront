import type { AuthUser, OtpChallenge, OtpErrorCode } from "@/types/auth";

export type RegisterPayload = {
    fullName: string;
    phone: string;
    password: string;
    captchaToken: string;
    acceptedTerms: boolean;
};

export type RegisterResponse = {
    verificationId: string;
    maskedPhone: string;
    codeLength: 5;
    expiresAt: string;
    resendAvailableAt: string;
};

export type VerifyPayload = { verificationId: string; code: string };
export type VerifyResponse = { user: AuthUser };

export type ResendPayload = { verificationId: string };
export type ResendResponse = { expiresAt: string; resendAvailableAt: string };

export type FieldErrors = Record<string, string | string[]>;

export type RegisterApi = {
    register: (payload: RegisterPayload) => Promise<RegisterResponse>;
    verify: (payload: VerifyPayload) => Promise<VerifyResponse>;
    resend: (payload: ResendPayload) => Promise<ResendResponse>;
};


export type RegisterErrorCode = "PHONE_ALREADY_REGISTERED" | OtpErrorCode;

export type VerificationSession = OtpChallenge & {
  phone: string;
  fullName: string;
};