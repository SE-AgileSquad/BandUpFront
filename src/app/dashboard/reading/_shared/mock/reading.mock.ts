import { ApiError } from "@/types/api";
import { SUBMIT_TIMEOUT_MS } from "../constants/reading";
import type { PassageSummary, ReadingApi, ResultPayload } from "../types";
import {
    ANSWER_KEY,
    PASSAGE_CATALOG,
    buildPassage,
    scoreAnswers,
} from "./reading.mock-data";

const STORAGE_KEY = "bandup:mock:reading:v1";
const DURATION_MS = 20 * 60_000;
const GRACE_MS = 60_000;
const DELAY_MS = 500;
const PASSAGE_IMAGES: Record<string, string> = {
    "cooling-cities": "/images/Reading/img_cooling_cities.jpg",
    "history-of-tea": "/images/Reading/img_history_of_tea.jpg",
    "history-of-timekeeping": "/images/Reading/img_timekeeping.jpg",
    "urban-beekeeping": "/images/Reading/img_urban_beekeeping.jpg",
};

type MockAttempt = {
    id: string;
    passageId: string;
    startedAt: number;
    endsAt: number;
    submittedAt: number | null;
};

type MockState = {
    attempts: Record<string, MockAttempt>;
    results: Record<string, ResultPayload>;
    completed: Record<string, { attemptId: string; correct: number; total: number }>;
    keys: Record<string, string>;
};

let memory: MockState | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const iso = (timestamp: number) => new Date(timestamp).toISOString();

function flag(name: string) {
    try {
        return window.localStorage.getItem(`bandup:mock:${name}`) === "1";
    } catch {
        return false;
    }
}

function clearFlag(name: string) {
    try {
        window.localStorage.removeItem(`bandup:mock:${name}`);
    } catch {
        // ignore
    }
}

function seed(): MockState {
    const now = Date.now();
    const teaAnswers = { ...ANSWER_KEY, q2: "FALSE", q5: "TRUE", q9: "TRUE" };
    const tea = scoreAnswers("history-of-tea", "mock-attempt-tea", "The History of Tea", teaAnswers);

    return {
        attempts: {
            "mock-attempt-cooling": {
                id: "mock-attempt-cooling",
                passageId: "cooling-cities",
                startedAt: now - 8 * 60_000,
                endsAt: now + 12 * 60_000,
                submittedAt: null,
            },
            "mock-attempt-tea": {
                id: "mock-attempt-tea",
                passageId: "history-of-tea",
                startedAt: now - 86_400_000,
                endsAt: now - 86_400_000 + DURATION_MS,
                submittedAt: now - 86_400_000 + 15 * 60_000,
            },
        },
        results: { "mock-attempt-tea": tea },
        completed: {
            "history-of-tea": { attemptId: "mock-attempt-tea", correct: tea.correct, total: tea.total },
        },
        keys: {},
    };
}

function persist(state: MockState) {
    memory = state;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // memory copy is enough for this session
    }
}

function load(): MockState {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as MockState;
    } catch {
        // fall through to memory or seed
    }
    if (!memory) persist(seed());
    return memory as MockState;
}

function findActive(state: MockState, passageId: string, now: number) {
    return Object.values(state.attempts).find(
        (attempt) =>
            attempt.passageId === passageId && attempt.submittedAt === null && attempt.endsAt > now,
    );
}

function toAttempt(attempt: MockAttempt, now: number) {
    return {
        id: attempt.id,
        passageId: attempt.passageId,
        startedAt: iso(attempt.startedAt),
        endsAt: iso(attempt.endsAt),
        serverNow: iso(now),
    };
}

function fail(status: number, code: string, message = code): never {
    throw new ApiError(message, status, code, { code });
}

export const readingMockApi: ReadingApi = {
    async listPassages() {
        await sleep(DELAY_MS);
        const state = load();
        const now = Date.now();

        const items = PASSAGE_CATALOG.map((passage): PassageSummary => {
            const active = findActive(state, passage.id, now);
            const done = state.completed[passage.id];
            return {
                id: passage.id,
                title: passage.title,
                imageUrl: PASSAGE_IMAGES[passage.id] ?? null,
                questionCount: 10,
                durationMinutes: 20,
                status: active ? "in_progress" : done ? "completed" : "new",
                lastResult: done ? { correct: done.correct, total: done.total } : undefined,
                lastAttemptId: done?.attemptId,
                activeAttempt: active
                    ? { endsAt: iso(active.endsAt), serverNow: iso(now) }
                    : undefined,
            };
        });

        return { items };
    },

    async startAttempt(passageId) {
        await sleep(DELAY_MS);
        const passage = buildPassage(passageId);
        if (!passage) fail(404, "NOT_FOUND");

        const state = load();
        const now = Date.now();
        let attempt = findActive(state, passageId, now);

        if (!attempt) {
            attempt = {
                id: `mock-attempt-${now.toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
                passageId,
                startedAt: now,
                endsAt: now + DURATION_MS,
                submittedAt: null,
            };
            state.attempts[attempt.id] = attempt;
            persist(state);
        }

        return { attempt: toAttempt(attempt, now), passage };
    },

    async submitAttempt(attemptId, payload) {
        if (flag("failSubmit")) {
            await sleep(DELAY_MS);
            throw new ApiError("Network Error", 0, "ERR_NETWORK");
        }
        if (flag("slowSubmit")) {
            await sleep(SUBMIT_TIMEOUT_MS);
            throw new ApiError(`timeout of ${SUBMIT_TIMEOUT_MS}ms exceeded`, 0, "ECONNABORTED");
        }

        await sleep(DELAY_MS);
        const state = load();
        const now = Date.now();
        const attempt = state.attempts[attemptId];
        if (!attempt) fail(404, "NOT_FOUND");

        const previous = state.keys[payload.idempotencyKey];
        if (previous && state.results[previous]) return state.results[previous];

        if (flag("expired")) {
            clearFlag("expired");
            attempt.endsAt = now - GRACE_MS - 1;
            persist(state);
            fail(410, "ATTEMPT_EXPIRED");
        }

        if (attempt.submittedAt !== null) fail(409, "ATTEMPT_ALREADY_SUBMITTED");
        if (now > attempt.endsAt + GRACE_MS) fail(410, "ATTEMPT_EXPIRED");

        const title = PASSAGE_CATALOG.find((p) => p.id === attempt.passageId)?.title ?? "";
        const result = scoreAnswers(attempt.passageId, attempt.id, title, payload.answers);

        attempt.submittedAt = now;
        state.results[attempt.id] = result;
        state.keys[payload.idempotencyKey] = attempt.id;
        state.completed[attempt.passageId] = {
            attemptId: attempt.id,
            correct: result.correct,
            total: result.total,
        };
        persist(state);
        return result;
    },

    async getResult(attemptId) {
        await sleep(DELAY_MS);
        const result = load().results[attemptId];
        if (!result) fail(404, "NOT_FOUND");
        return result;
    },
};
