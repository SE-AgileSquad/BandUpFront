import { ApiError } from "@/lib/api-client";
import { RESEND_COOLDOWN_SECONDS } from "../constants/auth.constants";
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

const MOCK_DELAY_MS = 800;
const MOCK_CODE_EXPIRES_SECONDS = 600;
const MOCK_RETRY_AFTER_SECONDS = 300;

function wait() {
    return new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
}

function apiError(
    status: number,
    code: string,
    extra: { fieldErrors?: Record<string, string>; retryAfterSeconds?: number } = {},
) {
    return Object.assign(new ApiError("Mock error", status), { status, code, ...extra });
}

export async function mockRegister(
    payload: RegisterPayload,
): Promise<RegisterResponse> {
    await wait();

    switch (payload.email) {
        case "taken@test.com":
            throw apiError(409, "EMAIL_EXISTS");
        case "captcha@test.com":
            throw apiError(422, "CAPTCHA_FAILED");
        case "fields@test.com":
            throw apiError(400, "VALIDATION_ERROR", {
                fieldErrors: { displayName: "That display name is not allowed." },
            });
        case "limit@test.com":
            throw apiError(429, "RATE_LIMITED");
        case "down@test.com":
            throw new TypeError("Failed to fetch");
        default:
            return {
                email: payload.email,
                codeExpiresInSeconds: MOCK_CODE_EXPIRES_SECONDS,
                resendCooldownSeconds: RESEND_COOLDOWN_SECONDS,
            };
    }
}

export async function mockVerifyEmail(
    payload: VerifyEmailPayload,
): Promise<VerifyEmailResponse> {
    await wait();

    switch (payload.code) {
        case "000000":
            throw apiError(400, "CODE_INVALID");
        case "111111":
            throw apiError(410, "CODE_EXPIRED");
        case "222222":
            throw apiError(429, "RATE_LIMITED");
        case "333333":
            throw new TypeError("Failed to fetch");
        default:
            return {
                user: { id: "mock-user", email: payload.email, displayName: "Mock User" },
            };
    }
}

export async function mockResendVerification(
    payload: ResendVerificationPayload,
): Promise<ResendVerificationResponse> {
    await wait();

    if (payload.email === "limit@test.com") {
        throw apiError(429, "RATE_LIMITED", {
            retryAfterSeconds: MOCK_RETRY_AFTER_SECONDS,
        });
    }

    return { resendCooldownSeconds: RESEND_COOLDOWN_SECONDS };
}

export async function mockLogin(payload: LoginPayload): Promise<LoginResponse> {
    await wait();

    switch (payload.email) {
        case "wrong@test.com":
            throw apiError(401, "INVALID_CREDENTIALS");
        case "unverified@test.com":
            throw apiError(403, "EMAIL_NOT_VERIFIED");
        case "captcha@test.com":
            throw apiError(422, "CAPTCHA_FAILED");
        case "limit@test.com":
            throw apiError(429, "RATE_LIMITED");
        case "down@test.com":
            throw new TypeError("Failed to fetch");
        default:
            return {
                user: { id: "mock-user", email: payload.email, displayName: "Mock User" },
            };
    }
}