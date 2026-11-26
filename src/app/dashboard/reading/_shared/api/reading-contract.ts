import type { Passage, PassageSummary, ResultPayload, StartAttemptResponse } from "../types";

type ApiQuestionType = "TrueFalseNotGiven" | "SentenceCompletion";

export type PassageSummaryDto = { id: string; title: string; questionCount: number };
export type PassageDto = {
    id: string;
    title: string;
    body: string;
    questions: { id: string; type: ApiQuestionType; prompt: string; sortOrder: number }[];
};
export type AttemptDto = {
    id: string;
    passageId: string;
    startedAt: string;
    expiresAt: string;
    serverNow: string;
    answers: { questionId: string; selectedAnswer: string }[];
};
export type AttemptSummaryDto = {
    passageId: string;
    attemptId: string;
    state: "InProgress" | "Completed";
    remainingSeconds: number | null;
    rawScore: number | null;
    totalQuestions: number | null;
};
export type AttemptResultDto = {
    attemptId: string;
    passageId: string;
    passageTitle: string;
    rawScore: number;
    totalQuestions: number;
    approxBand: number | null;
    questions: { type: ApiQuestionType; isCorrect: boolean; selectedAnswer: string | null }[];
};

const questionLabels: Record<ApiQuestionType, string> = {
    TrueFalseNotGiven: "True, False or Not Given",
    SentenceCompletion: "Sentence completion",
};

export function toPassageSummary(
    passage: PassageSummaryDto,
    attempt: AttemptSummaryDto | undefined,
    receivedAt: number,
): PassageSummary {
    const row: PassageSummary = {
        id: passage.id,
        title: passage.title,
        imageUrl: null,
        questionCount: passage.questionCount,
        durationMinutes: 20,
        status: "new",
    };

    if (attempt?.state === "Completed") {
        row.status = "completed";
        row.lastAttemptId = attempt.attemptId;
        if (attempt.rawScore !== null && attempt.totalQuestions !== null) {
            row.lastResult = { correct: attempt.rawScore, total: attempt.totalQuestions };
        }
    } else if (attempt?.state === "InProgress" && attempt.remainingSeconds != null) {
        row.status = "in_progress";
        row.activeAttempt = {
            endsAt: new Date(receivedAt + attempt.remainingSeconds * 1000).toISOString(),
            serverNow: new Date(receivedAt).toISOString(),
        };
    }

    return row;
}

export function toStartedAttempt(attempt: AttemptDto, content: PassageDto): StartAttemptResponse {
    const questionTypes = new Map(content.questions.map(({ id, type }) => [id, type]));
    const passage: Passage = {
        id: content.id,
        title: content.title,
        eyebrow: "Academic Reading",
        paragraphs: content.body.trim().split(/\r?\n[ \t]*\r?\n/).filter((text) => text.trim()).map((text, index) => ({
            label: index < 26 ? String.fromCharCode(65 + index) : String(index + 1),
            text: text.trim(),
        })),
        questions: [...content.questions].sort((first, second) => first.sortOrder - second.sortOrder).map((question, index) => ({
            id: question.id,
            number: index + 1,
            type: question.type === "TrueFalseNotGiven" ? "tfng" : "completion",
            groupLabel: questionLabels[question.type],
            prompt: question.prompt,
        })),
    };

    return {
        attempt: {
            id: attempt.id,
            passageId: attempt.passageId,
            startedAt: attempt.startedAt,
            endsAt: attempt.expiresAt,
            serverNow: attempt.serverNow,
        },
        passage,
        savedAnswers: Object.fromEntries(attempt.answers.map(({ questionId, selectedAnswer }) => [
            questionId,
            questionTypes.get(questionId) === "TrueFalseNotGiven"
                ? selectedAnswer.trim().toUpperCase()
                : selectedAnswer,
        ])),
    };
}

export function toResult(result: AttemptResultDto): ResultPayload {
    const breakdown = new Map<ApiQuestionType, ResultPayload["breakdown"][number]>();
    for (const question of result.questions) {
        const item = breakdown.get(question.type) ?? { label: questionLabels[question.type], total: 0, correct: 0 };
        item.total += 1;
        if (question.isCorrect) item.correct += 1;
        breakdown.set(question.type, item);
    }

    return {
        attemptId: result.attemptId,
        passageId: result.passageId,
        title: result.passageTitle,
        correct: result.rawScore,
        total: result.totalQuestions,
        band: result.approxBand,
        answered: result.questions.filter((question) => question.selectedAnswer?.trim()).length,
        breakdown: [...breakdown.values()],
    };
}
