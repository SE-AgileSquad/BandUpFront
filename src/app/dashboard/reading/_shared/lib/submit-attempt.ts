import { ApiError } from "@/types/api";
import { readingApi } from "../api";
import { draftStore } from "../storage/draft-store";
import type { Draft, ResultPayload, SubmitPayload } from "../types";

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

function createKey() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

const hasCode = (error: unknown, status: number, code: string) =>
    error instanceof ApiError && error.status === status && error.code === code;

function classify(error: unknown) {
    if (error instanceof SessionExpiredError || error instanceof SubmitFailedError) {
        return error;
    }
    if (error instanceof ApiError && error.status === 401) return new SessionExpiredError();
    return new SubmitFailedError();
}

export async function submitAttempt({
    draft,
    userId,
}: {
    draft: Draft;
    userId: string;
}): Promise<ResultPayload> {
    let current = draftStore.save(userId, {
        ...draft,
        idempotencyKey: draft.idempotencyKey ?? createKey(),
        status: "pending_submit",
    });

    const body = (extra: Partial<SubmitPayload> = {}): SubmitPayload => ({
        answers: current.answers,
        idempotencyKey: current.idempotencyKey as string,
        clientSubmittedAt: new Date().toISOString(),
        ...extra,
    });

    const sendTo = async (
        attemptId: string,
        extra?: Partial<SubmitPayload>,
    ): Promise<ResultPayload> => {
        try {
            return await readingApi.submitAttempt(attemptId, body(extra));
        } catch (error) {
            if (hasCode(error, 409, "ATTEMPT_ALREADY_SUBMITTED")) {
                return readingApi.getResult(attemptId);
            }
            throw error;
        }
    };

    const recover = async () => {
        let recoveryId = current.recoveryAttemptId;
        if (!recoveryId) {
            const started = await readingApi.startAttempt(current.passageId);
            recoveryId = started.attempt.id;
            current = draftStore.save(userId, { ...current, recoveryAttemptId: recoveryId });
        }
        return sendTo(recoveryId, { recovered: true, originalAttemptId: current.attemptId });
    };

    try {
        let result: ResultPayload;
        try {
            result = await sendTo(current.attemptId);
        } catch (error) {
            if (!hasCode(error, 410, "ATTEMPT_EXPIRED")) throw error;
            result = await recover();
        }
        draftStore.remove(userId, current.passageId);
        return result;
    } catch (error) {
        throw classify(error);
    }
}