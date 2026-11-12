import { maskPhone } from "@/lib/phone";
import { mockSession } from "@/lib/mock-session";
import { ApiError } from "@/types/api";
import type { AuthUser } from "@/types/auth";
import {
    LOGIN_LIMITS,
    MOCK_EXPIRED_CODE,
    MOCK_LOGIN_PASSWORD,
    MOCK_LOGIN_PHONE,
    MOCK_VALID_CODE,
} from "../constants/login";
import type { LoginApi, LoginErrorCode } from "../types";

type MockChallenge = {
    phone: string;
    wrongAttempts: number;
    lockedUntil: number | null;
};

const challenges = new Map<string, MockChallenge>();

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));
const iso = (timestamp: number) => new Date(timestamp).toISOString();

function fail(
    status: number,
    code: LoginErrorCode,
    extra: Record<string, unknown> = {},
): never {
    throw new ApiError(code, status, code, { code, ...extra });
}

function mockUser(phone: string): AuthUser {
    return { id: `mock-user-${phone}`, fullName: "BandUp Student", phone };
}

function getChallenge(id: string) {
    let entry = challenges.get(id);
    if (!entry) {
        entry = { phone: MOCK_LOGIN_PHONE, wrongAttempts: 0, lockedUntil: null };
        challenges.set(id, entry);
    }
    return entry;
}

export const loginApi: LoginApi = {
    async login({ phone, password }) {
        await delay();
        if (phone !== MOCK_LOGIN_PHONE || password !== MOCK_LOGIN_PASSWORD) {
            fail(401, "INVALID_CREDENTIALS");
        }
        const user = mockUser(phone);
        mockSession.set(user);
        return { user };
    },

    async sendCode({ phone }) {
        await delay();
        const verificationId = `mock-login-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        challenges.set(verificationId, { phone, wrongAttempts: 0, lockedUntil: null });

        const now = Date.now();
        return {
            verificationId,
            maskedPhone: maskPhone(phone),
            codeLength: 5,
            expiresAt: iso(now + LOGIN_LIMITS.codeTtlMs),
            resendAvailableAt: iso(now + LOGIN_LIMITS.resendCooldownMs),
        };
    },

    async verifyCode({ verificationId, code }) {
        await delay();
        const entry = getChallenge(verificationId);

        if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
            fail(429, "TOO_MANY_ATTEMPTS", { lockedUntil: iso(entry.lockedUntil) });
        }

        if (code === MOCK_VALID_CODE) {
            const user = mockUser(entry.phone);
            mockSession.set(user);
            return { user };
        }

        if (code === MOCK_EXPIRED_CODE) fail(410, "CODE_EXPIRED");

        entry.wrongAttempts += 1;
        if (entry.wrongAttempts >= LOGIN_LIMITS.maxWrongAttempts) {
            entry.lockedUntil = Date.now() + LOGIN_LIMITS.lockMs;
            fail(429, "TOO_MANY_ATTEMPTS", { lockedUntil: iso(entry.lockedUntil) });
        }

        fail(400, "INVALID_CODE", {
            attemptsRemaining: LOGIN_LIMITS.maxWrongAttempts - entry.wrongAttempts,
        });
    },

    async resendCode({ verificationId }) {
        await delay();
        const entry = getChallenge(verificationId);
        entry.wrongAttempts = 0;
        entry.lockedUntil = null;

        const now = Date.now();
        return {
            expiresAt: iso(now + LOGIN_LIMITS.codeTtlMs),
            resendAvailableAt: iso(now + LOGIN_LIMITS.resendCooldownMs),
        };
    },
};