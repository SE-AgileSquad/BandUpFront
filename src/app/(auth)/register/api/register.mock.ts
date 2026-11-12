import { maskPhone } from "@/lib/phone";
import { mockSession } from "@/lib/mock-session";
import { ApiError } from "@/types/api";
import {
    MOCK_EXPIRED_CODE,
    MOCK_TAKEN_PHONE,
    MOCK_VALID_CODE,
    REGISTER_LIMITS,
} from "../constants/register";
import type { RegisterApi, RegisterErrorCode } from "../types";

type MockVerification = {
    fullName: string;
    phone: string;
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
        entry = { fullName: "BandUp Student", phone: "", wrongAttempts: 0, lockedUntil: null };
        verifications.set(id, entry);
    }
    return entry;
}

export const registerApi: RegisterApi = {
    async register(payload) {
        await delay();
        if (payload.phone === MOCK_TAKEN_PHONE) fail(409, "PHONE_ALREADY_REGISTERED");

        const verificationId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        verifications.set(verificationId, {
            fullName: payload.fullName,
            phone: payload.phone,
            wrongAttempts: 0,
            lockedUntil: null,
        });

        const now = Date.now();
        return {
            verificationId,
            maskedPhone: maskPhone(payload.phone),
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
                fullName: entry.fullName,
                phone: entry.phone,
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