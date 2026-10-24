import { apiFetch } from "@/lib/api-client";
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResendVerificationPayload,
  ResendVerificationResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
} from "../types/auth.types";
import {
  mockLogin,
  mockRegister,
  mockResendVerification,
  mockVerifyEmail,
} from "./auth.mock";

const AUTH_BASE_PATH = "/api/v1/auth";
const JSON_HEADERS = { "Content-Type": "application/json" };
const USE_MOCK = process.env.NEXT_PUBLIC_AUTH_MOCK === "true";

function post<TResponse>(path: string, payload: unknown): Promise<TResponse> {
  return apiFetch<TResponse>(`${AUTH_BASE_PATH}${path}`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload: RegisterPayload) {
  return USE_MOCK
    ? mockRegister(payload)
    : post<RegisterResponse>("/register", payload);
}

export function loginUser(payload: LoginPayload) {
  return USE_MOCK ? mockLogin(payload) : post<LoginResponse>("/login", payload);
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return USE_MOCK
    ? mockVerifyEmail(payload)
    : post<VerifyEmailResponse>("/verify-email", payload);
}

export function resendVerificationCode(payload: ResendVerificationPayload) {
  return USE_MOCK
    ? mockResendVerification(payload)
    : post<ResendVerificationResponse>("/resend-verification", payload);
}