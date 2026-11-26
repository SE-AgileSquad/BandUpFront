import { DASHBOARD_ROUTES } from "@/constants/routes";
import type { TfngValue } from "../types";

export const READING_API_PREFIX = "/api/reading";
export const SUBMIT_TIMEOUT_MS = 10_000;
export const DRAFT_VERSION = 1;
export const DRAFT_KEY_PREFIX = "bandup:reading:v1";

const enc = encodeURIComponent;

export const READING_PATHS = {
    LIST: DASHBOARD_ROUTES.READING,
    test: (passageId: string) => `${DASHBOARD_ROUTES.READING}/${enc(passageId)}/test`,
    result: (passageId: string, attemptId: string) =>
        `${DASHBOARD_ROUTES.READING}/${enc(passageId)}/result/${enc(attemptId)}`,
    review: (passageId: string, attemptId: string) =>
        `${DASHBOARD_ROUTES.READING}/${enc(passageId)}/review/${enc(attemptId)}`,
    recover: (passageId: string) =>
        `${DASHBOARD_ROUTES.READING}?recover=${enc(passageId)}`,
};

export const TFNG_OPTIONS: { value: TfngValue; label: string }[] = [
    { value: "TRUE", label: "True" },
    { value: "FALSE", label: "False" },
    { value: "NOT GIVEN", label: "Not Given" },
];

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const SHARED_COPY = {
    chipSaved: "Saved on this device",
    submitting: {
        manualTitle: "Submitting your test…",
        manualText:
            "Your answers are locked while we submit. Please wait; don’t submit again.",
        timeupTitle: "Time’s up",
        timeupText: (unanswered: number) =>
            `The timer reached 00:00. We’re automatically submitting your saved answers.${unanswered > 0
                ? ` ${unanswered} unanswered ${plural(unanswered, "question", "questions")} will be marked wrong.`
                : ""
            }`,
        saving: "Saving all answers securely…",
        progressLabel: "Submitting",
        button: "Submitting…",
    },
    failed: {
        title: "Your test couldn’t be submitted",
        text: (answered: number) =>
            `${answered > 0
                ? `All ${answered} ${plural(answered, "answer is", "answers are")} kept on this device.`
                : "Your progress is kept on this device."
            } No partial score has been created. Retry safely, or return to your test.`,
        retry: "Retry submission",
        backToTest: "Back to test",
        backToList: "Back to reading tests",
    },
} as const;
