import type { AuthUser, OtpChallenge, OtpErrorCode } from "@/types/auth";

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
  captchaToken: string;
};

export type StartOtpPayload = { email: string; displayName: string };

export type RegisterResponse = {
  verificationId: string;
  maskedEmail: string;
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
    register: (payload: RegisterPayload) => Promise<AuthUser>;
    sendCode: (payload: StartOtpPayload) => Promise<RegisterResponse>;
    verify: (payload: VerifyPayload) => Promise<VerifyResponse>;
    resend: (payload: ResendPayload) => Promise<ResendResponse>;
};


export type RegisterErrorCode = "EMAIL_ALREADY_REGISTERED" | OtpErrorCode;

export type VerificationSession = OtpChallenge & {
  email: string;
  displayName: string;
  user: AuthUser;
};
