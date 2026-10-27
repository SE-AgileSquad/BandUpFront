import type { CurrentUserData } from "../types/dashboard.types";

const identity = {
    id: "u_1",
    displayName: "Sara Ahmadi",
    email: "sara@example.com",
    role: "user",
} as const;

export const mockReturningUser: CurrentUserData = {
    state: "returning",
    user: { ...identity, credits: 2 },
    summary: {
        dueToday: { phrases: 8, cards: 12 },
        accuracy: {
            trueFalseNotGiven: { correct: 8, total: 13 },
            sentenceCompletion: { correct: 11, total: 13 },
        },
        lessons: { completed: 2, total: 5 },
        lastTest: {
            title: "Passage 1",
            date: "2026-10-20",
            score: 7,
            outOf: 10,
            estimatedBand: 5.5,
        },
    },
};

export const mockNewUser: CurrentUserData = {
    state: "new",
    user: { ...identity, credits: 3 },
    summary: {
        dueToday: { phrases: 0, cards: 0 },
        accuracy: {
            trueFalseNotGiven: { correct: 0, total: 0 },
            sentenceCompletion: { correct: 0, total: 0 },
        },
        lessons: { completed: 0, total: 5 },
        lastTest: null,
    },
};