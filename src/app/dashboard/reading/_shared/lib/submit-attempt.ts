import { ApiError } from "@/types/api";
import { readingApi } from "../api";
import type { Answers, ResultPayload } from "../types";

export class SessionExpiredError extends Error {
    constructor() {
        super("Session expired");
        this.name = "SessionExpiredError";
    }
}

export class SubmitFailedError extends Error {
    constructor() {
        super("Submit failed");
        this.name = "SubmitFailedError";
    }
}

export function createSubmissionKey() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

const hasCode = (error: unknown, status: number, code: string) =>
    error instanceof ApiError && error.status === status && error.code === code;

function classify(error: unknown) {
    if (error instanceof SessionExpiredError || error instanceof SubmitFailedError) return error;
    if (error instanceof ApiError && error.status === 401) return new SessionExpiredError();
    return new SubmitFailedError();
}

export async function submitAttempt({
    attemptId,
    answers,
    idempotencyKey,
}: {
    attemptId: string;
    answers: Answers;
    idempotencyKey: string;
}): Promise<ResultPayload> {
    try {
        try {
            return await readingApi.submitAttempt(attemptId, { answers, idempotencyKey });
        } catch (error) {
            if (
                hasCode(error, 409, "ATTEMPT_ALREADY_SUBMITTED") ||
                hasCode(error, 410, "ATTEMPT_EXPIRED")
            ) {
                return await readingApi.getResult(attemptId);
            }
            throw error;
        }
    } catch (error) {
        throw classify(error);
    }
}

export async function getExpiredAttemptResult(attemptId: string): Promise<ResultPayload> {
    try {
        await readingApi.waitForAnswerUpdates(attemptId);
        return await readingApi.getResult(attemptId);
    } catch (error) {
        throw classify(error);
    }
}
