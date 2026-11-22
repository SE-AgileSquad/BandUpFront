export type PassageStatus = "new" | "in_progress" | "completed";
export type QuestionType = "tfng" | "completion";
export type TfngValue = "TRUE" | "FALSE" | "NOT_GIVEN";
export type SubmitReason = "manual" | "timeup";
export type MobileTab = "passage" | "questions";
export type DraftStatus = "in_progress" | "pending_submit";

export type PassageSummary = {
    id: string;
    title: string;
    imageUrl: string | null;
    questionCount: number;
    durationMinutes: number;
    status: PassageStatus;
    lastResult?: { correct: number; total: number };
    lastAttemptId?: string;
    activeAttempt?: { endsAt: string; serverNow: string };
};

export type Question = {
    id: string;
    number: number;
    type: QuestionType;
    groupLabel: string;
    prompt: string;
};

export type Attempt = {
    id: string;
    passageId: string;
    startedAt: string;
    endsAt: string;
    serverNow: string;
};

export type Passage = {
    id: string;
    title: string;
    eyebrow: string;
    paragraphs: { label: string; text: string }[];
    questions: Question[];
};

export type Answers = Record<string, string>;

export type StartAttemptResponse = { attempt: Attempt; passage: Passage };

export type SubmitPayload = {
    answers: Answers;
    idempotencyKey: string;
    clientSubmittedAt: string;
    recovered?: true;
    originalAttemptId?: string;
};

export type BreakdownItem = { label: string; correct: number; total: number };

export type ResultPayload = {
    attemptId: string;
    passageId: string;
    title: string;
    correct: number;
    total: number;
    headline: string;
    band: number;
    breakdown: BreakdownItem[];
    suggestedLesson?: { title: string; href: string };
    newParaphraseCount?: number;
};

export type Draft = {
    v: 1;
    passageId: string;
    attemptId: string;
    startedAt: string;
    endsAt: string;
    serverOffsetMs: number;
    answers: Answers;
    currentIndex: number;
    mobileTab: MobileTab;
    status: DraftStatus;
    idempotencyKey?: string;
    recoveryAttemptId?: string;
    savedAt: number;
    checksum: string;
};

export type DraftInput = Omit<Draft, "v" | "savedAt" | "checksum">;

export type ReadingApi = {
    listPassages: () => Promise<{ items: PassageSummary[] }>;
    startAttempt: (passageId: string) => Promise<StartAttemptResponse>;
    submitAttempt: (attemptId: string, payload: SubmitPayload) => Promise<ResultPayload>;
    getResult: (attemptId: string) => Promise<ResultPayload>;
};