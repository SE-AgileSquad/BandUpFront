"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    useStartAttemptMutation,
    useSubmitAttemptMutation,
    useUpdateAnswerMutation,
} from "@/app/dashboard/reading/_shared/api/reading.queries";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import { computeOffset } from "@/app/dashboard/reading/_shared/lib/clock";
import { loginUrl } from "@/app/dashboard/reading/_shared/lib/login-url";
import {
    createSubmissionKey,
    getExpiredAttemptResult,
    SessionExpiredError,
} from "@/app/dashboard/reading/_shared/lib/submit-attempt";
import type { Attempt, MobileTab, Passage, SubmitReason, TestProgress } from "@/app/dashboard/reading/_shared/types";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/types/api";
import { TFNG_OPTIONS } from "@/app/dashboard/reading/_shared/constants/reading";
import { useAttemptTimer } from "./use-attempt-timer";

export type Phase =
    | { kind: "loading" }
    | { kind: "error" }
    | { kind: "answering" }
    | { kind: "confirming" }
    | { kind: "leaving" }
    | { kind: "submitting"; reason: SubmitReason }
    | { kind: "failed"; reason: SubmitReason }
    | { kind: "sessionExpired" };

type State = {
    phase: Phase;
    passage: Passage | null;
    attempt: Attempt | null;
    progress: TestProgress | null;
};

type Action =
    | { type: "loaded"; passage: Passage; attempt: Attempt; progress: TestProgress }
    | { type: "progress"; progress: TestProgress }
    | { type: "phase"; phase: Phase };

const initialState: State = { phase: { kind: "loading" }, passage: null, attempt: null, progress: null };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "loaded":
            return { phase: { kind: "answering" }, passage: action.passage, attempt: action.attempt, progress: action.progress };
        case "progress":
            return { ...state, progress: action.progress };
        case "phase":
            return { ...state, phase: action.phase };
    }
}

function apiAnswer(value: string, isTfng: boolean) {
    if (!isTfng) return value;
    return TFNG_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function useTestSession(passageId: string) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading: authLoading } = useAuth();
    const userId = user?.id ?? null;
    const { mutateAsync: startAttempt } = useStartAttemptMutation();
    const { mutateAsync: submitMutation } = useSubmitAttemptMutation();
    const { mutate: updateAnswer } = useUpdateAnswerMutation();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [nonce, setNonce] = useState(0);
    const progressRef = useRef<TestProgress | null>(null);
    const phaseRef = useRef<Phase>(state.phase);
    const submittingRef = useRef(false);
    const submissionKeyRef = useRef<string | null>(null);
    const startedFor = useRef(-1);

    useEffect(() => { phaseRef.current = state.phase; });

    useEffect(() => {
        if (authLoading || !userId || startedFor.current === nonce) return;
        startedFor.current = nonce;
        startAttempt(passageId)
            .then(({ attempt, passage, savedAnswers }) => {
                const answers = { ...savedAnswers };
                for (const question of passage.questions) {
                    if (question.type === "tfng" && answers[question.id] === "NOT_GIVEN") {
                        answers[question.id] = "NOT GIVEN";
                    }
                }
                const progress: TestProgress = {
                    passageId,
                    attemptId: attempt.id,
                    startedAt: attempt.startedAt,
                    endsAt: attempt.endsAt,
                    serverOffsetMs: computeOffset(attempt.serverNow),
                    answers,
                    currentIndex: 0,
                    mobileTab: "passage",
                };
                progressRef.current = progress;
                dispatch({ type: "loaded", passage, attempt, progress });
            })
            .catch((error: unknown) => {
                if (error instanceof ApiError && error.status === 401) {
                    router.push(loginUrl(pathname));
                    return;
                }
                dispatch({ type: "phase", phase: { kind: "error" } });
            });
    }, [authLoading, userId, nonce, passageId, router, pathname, startAttempt]);

    const commit = useCallback((patch: Partial<TestProgress>) => {
        const current = progressRef.current;
        if (!current) return;
        const progress = { ...current, ...patch };
        progressRef.current = progress;
        dispatch({ type: "progress", progress });
    }, []);

    const runSubmit = useCallback(async (reason: SubmitReason) => {
        if (submittingRef.current) return;
        const current = progressRef.current;
        if (!current) return;
        submittingRef.current = true;
        dispatch({ type: "phase", phase: { kind: "submitting", reason } });
        try {
            const submitAnswers = Object.fromEntries(
                Object.entries(current.answers).map(([questionId, value]) => {
                    const question = state.passage?.questions.find((item) => item.id === questionId);
                    return [questionId, apiAnswer(value, question?.type === "tfng")];
                }),
            );
            const result = reason === "timeup"
                ? await getExpiredAttemptResult(current.attemptId)
                : await submitMutation({
                    attemptId: current.attemptId,
                    answers: submitAnswers,
                    idempotencyKey: submissionKeyRef.current ?? (submissionKeyRef.current = createSubmissionKey()),
                });
            router.replace(READING_PATHS.result(passageId, result.attemptId));
        } catch (error) {
            submittingRef.current = false;
            dispatch({
                type: "phase",
                phase: error instanceof SessionExpiredError
                    ? { kind: "sessionExpired" }
                    : { kind: "failed", reason },
            });
        }
    }, [passageId, router, state.passage, submitMutation]);

    const onTimeUp = useCallback(() => {
        if (phaseRef.current.kind !== "submitting") void runSubmit("timeup");
    }, [runSubmit]);

    const timerEnabled = state.attempt !== null && state.phase.kind !== "loading" && state.phase.kind !== "error";
    const remainingSeconds = useAttemptTimer({
        endsAt: state.progress?.endsAt ?? null,
        offsetMs: state.progress?.serverOffsetMs ?? 0,
        enabled: timerEnabled,
        onTimeUp,
    });

    const questions = state.passage?.questions ?? [];
    const answers = state.progress?.answers ?? {};
    const answeredCount = questions.filter((question) => answers[question.id]?.trim()).length;
    const phaseKind = state.phase.kind;

    const setAnswer = useCallback((questionId: string, value: string) => {
        if (phaseRef.current.kind !== "answering") return;
        const current = progressRef.current;
        if (!current) return;
        submissionKeyRef.current = null;
        const next = { ...current.answers };
        if (value.trim()) next[questionId] = value;
        else delete next[questionId];
        commit({ answers: next });
        const question = state.passage?.questions.find((item) => item.id === questionId);
        updateAnswer({
            attemptId: current.attemptId,
            questionId,
            selectedAnswer: apiAnswer(value, question?.type === "tfng"),
        });
    }, [commit, state.passage, updateAnswer]);

    const goTo = useCallback((index: number) => {
        if (phaseRef.current.kind !== "answering") return;
        const lastIndex = Math.max(0, (state.passage?.questions.length ?? 1) - 1);
        commit({ currentIndex: Math.min(Math.max(index, 0), lastIndex) });
    }, [commit, state.passage]);

    const setTab = useCallback((tab: MobileTab) => commit({ mobileTab: tab }), [commit]);
    const canReturnToTest = state.phase.kind === "failed" && state.phase.reason === "manual" && (remainingSeconds ?? 0) > 0;

    return {
        phase: state.phase,
        passage: state.passage,
        progress: state.progress,
        questions,
        answers,
        answeredCount,
        remainingSeconds,
        locked: phaseKind === "submitting",
        canReturnToTest,
        setAnswer,
        clearAnswer: (questionId: string) => setAnswer(questionId, ""),
        goTo,
        next: () => goTo((state.progress?.currentIndex ?? 0) + 1),
        prev: () => goTo((state.progress?.currentIndex ?? 0) - 1),
        setTab,
        openConfirm: () => { if (phaseRef.current.kind === "answering") dispatch({ type: "phase", phase: { kind: "confirming" } }); },
        openLeave: () => { if (phaseRef.current.kind === "answering") dispatch({ type: "phase", phase: { kind: "leaving" } }); },
        closeDialog: () => dispatch({ type: "phase", phase: { kind: "answering" } }),
        confirmSubmit: () => void runSubmit("manual"),
        leave: () => router.push(READING_PATHS.LIST),
        retrySubmit: () => {
            const reason = phaseRef.current.kind === "failed" ? phaseRef.current.reason : "manual";
            void runSubmit(reason);
        },
        backFromFailed: () => {
            if (canReturnToTest) dispatch({ type: "phase", phase: { kind: "answering" } });
            else router.push(READING_PATHS.LIST);
        },
        signIn: () => router.push(loginUrl(pathname)),
        retryLoad: () => {
            dispatch({ type: "phase", phase: { kind: "loading" } });
            setNonce((value) => value + 1);
        },
    };
}
