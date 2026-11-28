export type PassageStatus = "new" | "in_progress" | "completed";
export type QuestionType = "tfng" | "completion";
export type TfngValue = "TRUE" | "FALSE" | "NOT GIVEN";
export type SubmitReason = "manual" | "timeup";
export type MobileTab = "passage" | "questions";

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

export type StartAttemptResponse = { attempt: Attempt; passage: Passage; savedAnswers?: Answers };

export type SubmitPayload = {
    answers: Answers;
    idempotencyKey: string;
};

export type BreakdownItem = { label: string; correct: number; total: number };

export type ResultPayload = {
    attemptId: string;
    passageId: string;
    title: string;
    correct: number;
    total: number;
    headline?: string;
    band: number | null;
    answered?: number;
    breakdown: BreakdownItem[];
    suggestedLesson?: { title: string; href: string };
    newParaphraseCount?: number;
};

export type TestProgress = {
    passageId: string;
    attemptId: string;
    startedAt: string;
    endsAt: string;
    serverOffsetMs: number;
    answers: Answers;
    currentIndex: number;
    mobileTab: MobileTab;
};

export type ReadingApi = {
    listPassages: () => Promise<{ items: PassageSummary[] }>;
    startAttempt: (passageId: string) => Promise<StartAttemptResponse>;
    updateAnswer: (attemptId: string, questionId: string, selectedAnswer: string) => Promise<void>;
    waitForAnswerUpdates: (attemptId: string) => Promise<void>;
    submitAttempt: (attemptId: string, payload: SubmitPayload) => Promise<ResultPayload>;
    getResult: (attemptId: string) => Promise<ResultPayload>;
};
