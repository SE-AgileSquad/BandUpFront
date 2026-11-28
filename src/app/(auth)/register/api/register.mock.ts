import { maskEmail } from "@/lib/email";
import { mockSession } from "@/lib/mock-session";
import { ApiError } from "@/types/api";
import {
    MOCK_EXPIRED_CODE,
    MOCK_TAKEN_EMAIL,
    MOCK_VALID_CODE,
    REGISTER_LIMITS,
} from "../constants/register";
import type { RegisterApi, RegisterErrorCode, StartOtpPayload } from "../types";

type MockVerification = {
    displayName: string;
    email: string;
    wrongAttempts: number;
    lockedUntil: number | null;
};

const verifications = new Map<string, MockVerification>();

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));
const iso = (timestamp: number) => new Date(timestamp).toISOString();

function fail(
    status: number,
    code: RegisterErrorCode,
    extra: Record<string, unknown> = {},
): never {
    throw new ApiError(code, status, code, { code, ...extra });
}

function getVerification(id: string) {
    let entry = verifications.get(id);
    if (!entry) {
        entry = { displayName: "BandUp Student", email: "", wrongAttempts: 0, lockedUntil: null };
        verifications.set(id, entry);
    }
    return entry;
}

export const registerApi: RegisterApi = {
    async register(payload) {
        await delay();
        if (payload.email === MOCK_TAKEN_EMAIL) fail(409, "EMAIL_ALREADY_REGISTERED");

        const user = {
            id: `mock-user-${payload.email}`,
            displayName: payload.displayName,
            email: payload.email,
            role: "student",
            creditBalance: 0,
        };
        mockSession.set(user);
        return user;
    },

    async sendCode(payload: StartOtpPayload) {
        await delay();

        const verificationId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        verifications.set(verificationId, {
            displayName: payload.displayName,
            email: payload.email,
            wrongAttempts: 0,
            lockedUntil: null,
        });

        const now = Date.now();
        return {
            verificationId,
            maskedEmail: maskEmail(payload.email),
            codeLength: 5,
            expiresAt: iso(now + REGISTER_LIMITS.codeTtlMs),
            resendAvailableAt: iso(now + REGISTER_LIMITS.resendCooldownMs),
        };
    },

    async verify({ verificationId, code }) {
        await delay();
        const entry = getVerification(verificationId);

        if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
            fail(429, "TOO_MANY_ATTEMPTS", { lockedUntil: iso(entry.lockedUntil) });
        }

        if (code === MOCK_VALID_CODE) {
            const user = {
                id: `mock-user-${verificationId}`,
                displayName: entry.displayName,
                email: entry.email,
                role: "student",
                creditBalance: 0,
            };
            mockSession.set(user);
            return { user };
        }

        if (code === MOCK_EXPIRED_CODE) fail(410, "CODE_EXPIRED");

        entry.wrongAttempts += 1;
        if (entry.wrongAttempts >= REGISTER_LIMITS.maxWrongAttempts) {
            entry.lockedUntil = Date.now() + REGISTER_LIMITS.lockMs;
            fail(429, "TOO_MANY_ATTEMPTS", { lockedUntil: iso(entry.lockedUntil) });
        }

        fail(400, "INVALID_CODE", {
            attemptsRemaining: REGISTER_LIMITS.maxWrongAttempts - entry.wrongAttempts,
        });
    },

    async resend({ verificationId }) {
        await delay();
        const entry = getVerification(verificationId);
        entry.wrongAttempts = 0;
        entry.lockedUntil = null;

        const now = Date.now();
        return {
            expiresAt: iso(now + REGISTER_LIMITS.codeTtlMs),
            resendAvailableAt: iso(now + REGISTER_LIMITS.resendCooldownMs),
        };
    },
};
