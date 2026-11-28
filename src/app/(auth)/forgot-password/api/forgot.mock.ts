import { ApiError } from "@/types/api";
import {
    FORGOT_LIMITS,
    MOCK_EXPIRED_CODE,
    MOCK_REJECTED_PASSWORD,
    MOCK_VALID_CODE,
} from "../constants/forgot";
import { maskEmail } from "../lib/mask-email";
import type { ForgotApi, ForgotErrorCode } from "../types";

type MockChallenge = { wrongAttempts: number; lockedUntil: number | null };

const challenges = new Map<string, MockChallenge>();

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));
const iso = (timestamp: number) => new Date(timestamp).toISOString();

function fail(
    status: number,
    code: ForgotErrorCode,
    extra: Record<string, unknown> = {},
): never {
    throw new ApiError(code, status, code, { code, ...extra });
}

function getChallenge(email: string) {
    let entry = challenges.get(email);
    if (!entry) {
        entry = { wrongAttempts: 0, lockedUntil: null };
        challenges.set(email, entry);
    }
    return entry;
}

export const forgotApi: ForgotApi = {
    async sendCode({ email }) {
        await delay();
        challenges.set(email, { wrongAttempts: 0, lockedUntil: null });

        const now = Date.now();
        return {
            maskedEmail: maskEmail(email),
            expiresAt: iso(now + FORGOT_LIMITS.codeTtlMs),
            resendAvailableAt: iso(now + FORGOT_LIMITS.resendCooldownMs),
        };
    },

    async resendCode({ email }) {
        await delay();
        const entry = getChallenge(email);
        entry.wrongAttempts = 0;
        entry.lockedUntil = null;

        const now = Date.now();
        return {
            expiresAt: iso(now + FORGOT_LIMITS.codeTtlMs),
            resendAvailableAt: iso(now + FORGOT_LIMITS.resendCooldownMs),
        };
    },

    async reset({ email, code, newPassword }) {
        await delay();
        const entry = getChallenge(email);

        if (entry.lockedUntil && entry.lockedUntil > Date.now()) {
            fail(429, "TOO_MANY_ATTEMPTS", { lockedUntil: iso(entry.lockedUntil) });
        }

        if (code === MOCK_VALID_CODE) {
            if (newPassword === MOCK_REJECTED_PASSWORD) {
                fail(422, "PASSWORD_REJECTED", {
                    fieldErrors: {
                        newPassword: "Choose a password you haven’t used before.",
                    },
                });
            }
            return;
        }

        if (code === MOCK_EXPIRED_CODE) fail(410, "CODE_EXPIRED");

        entry.wrongAttempts += 1;
        if (entry.wrongAttempts >= FORGOT_LIMITS.maxWrongAttempts) {
            entry.lockedUntil = Date.now() + FORGOT_LIMITS.lockMs;
            fail(429, "TOO_MANY_ATTEMPTS", { lockedUntil: iso(entry.lockedUntil) });
        }

        fail(400, "INVALID_CODE", {
            attemptsRemaining: FORGOT_LIMITS.maxWrongAttempts - entry.wrongAttempts,
        });
    },
};
