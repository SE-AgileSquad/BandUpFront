import type { RegisterPayload } from "../schemas/sign-up.schema";
import type { LoginPayload } from "../schemas/login.schema";

export type { LoginPayload, RegisterPayload };


export interface RegisterResponse {
    email: string;
    codeExpiresInSeconds: number;
    resendCooldownSeconds: number;
}

export interface VerifyEmailPayload {
    email: string;
    code: string;
}

export interface AuthUser {
    id: string;
    email: string;
    displayName: string;
}

export interface VerifyEmailResponse {
    user: AuthUser;
}

export interface ResendVerificationPayload {
    email: string;
}

export interface ResendVerificationResponse {
    resendCooldownSeconds: number;
}

export interface VerificationEntry {
    email: string;
    displayName: string;
    cooldownSeconds: number;
}

export interface LoginResponse {
  user: AuthUser;
}

export type AuthErrorContext = "register" | "verify" | "resend" | "login";

export type AuthErrorKind =
  | "email-exists"
  | "field"
  | "captcha"
  | "code-invalid"
  | "code-expired"
  | "invalid-credentials"
  | "email-not-verified"
  | "rate-limit"
  | "network"
  | "unknown";

export type AuthErrorField = keyof RegisterPayload;

export interface MappedAuthError {
    kind: AuthErrorKind;
    message: string;
    field?: AuthErrorField;
    fieldErrors?: Partial<Record<AuthErrorField, string>>;
    retryAfterSeconds?: number;
}