import type { AuthUser, OtpErrorCode } from "@/types/auth";

export type LoginMethod = "password" | "email";
export type LoginReason = "session-expired";

export type LoginViewProps = {
    next: string | null;
    reason: LoginReason | null;
    method: LoginMethod;
};

export type LoginPayload = { email: string; password: string; captchaToken: string };
export type SendCodePayload = { email: string; captchaToken: string };
export type SendCodeResponse = {
  verificationId: string;
  maskedEmail: string;
  codeLength: 5;
  expiresAt: string;
  resendAvailableAt: string;
};

export type LoginResponse = { user: AuthUser };

export type VerifyCodePayload = { verificationId: string; code: string };
export type VerifyCodeResponse = { user: AuthUser };

export type ResendCodePayload = { verificationId: string };
export type ResendCodeResponse = { expiresAt: string; resendAvailableAt: string };

export type LoginErrorCode =
    | "INVALID_CREDENTIALS"
    | "CAPTCHA_INVALID"
    | OtpErrorCode;

export type LoginApi = {
    login: (payload: LoginPayload) => Promise<LoginResponse>;
    sendCode: (payload: SendCodePayload) => Promise<SendCodeResponse>;
    verifyCode: (payload: VerifyCodePayload) => Promise<VerifyCodeResponse>;
    resendCode: (payload: ResendCodePayload) => Promise<ResendCodeResponse>;
};
