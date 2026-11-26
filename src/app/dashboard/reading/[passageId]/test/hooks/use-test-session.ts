"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    useStartAttemptMutation,
    useSubmitAttemptMutation,
} from "@/app/dashboard/reading/_shared/api/reading.queries";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import { computeOffset } from "@/app/dashboard/reading/_shared/lib/clock";
import { loginUrl } from "@/app/dashboard/reading/_shared/lib/login-url";
import { SessionExpiredError } from "@/app/dashboard/reading/_shared/lib/submit-attempt";
import { draftStore } from "@/app/dashboard/reading/_shared/storage/draft-store";
import type {
    Attempt,
    Draft,
    DraftInput,
    MobileTab,
    Passage,
    SubmitReason,
} from "@/app/dashboard/reading/_shared/types";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/types/api";
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
    draft: Draft | null;
    storageOk: boolean;
};

type Action =
    | { type: "loaded"; passage: Passage; attempt: Attempt; draft: Draft; storageOk: boolean }
    | { type: "draft"; draft: Draft }
    | { type: "phase"; phase: Phase };

const initialState: State = {
    phase: { kind: "loading" },
    passage: null,
    attempt: null,
    draft: null,
    storageOk: true,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "loaded":
            return {
                phase: { kind: "answering" },
                passage: action.passage,
                attempt: action.attempt,
                draft: action.draft,
                storageOk: action.storageOk,
            };
        case "draft":
            return { ...state, draft: action.draft };
        case "phase":
            return { ...state, phase: action.phase };
    }
}

export function useTestSession(passageId: string) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading: authLoading } = useAuth();
    const userId = user?.id ?? null;

    const { mutateAsync: startAttempt } = useStartAttemptMutation();
    const { mutateAsync: submitMutation } = useSubmitAttemptMutation();

    const [state, dispatch] = useReducer(reducer, initialState);
    const [nonce, setNonce] = useState(0);
    const draftRef = useRef<Draft | null>(null);
    const phaseRef = useRef<Phase>(state.phase);
    const submittingRef = useRef(false);
    const startedFor = useRef(-1);

    useEffect(() => {
        phaseRef.current = state.phase;
    });

    useEffect(() => {
        if (authLoading || !userId || startedFor.current === nonce) return;
        startedFor.current = nonce;

        const existing = draftStore.get(userId, passageId);
        if (existing && draftStore.needsSubmit(existing)) {
            router.replace(READING_PATHS.recover(passageId));
            return;
        }

        startAttempt(passageId)
            .then(({ attempt, passage, savedAnswers }) => {
                const restorable = existing && existing.attemptId === attempt.id ? existing : null;
                const lastIndex = passage.questions.length - 1;
                const answers = { ...(restorable?.answers ?? savedAnswers) };
                for (const question of passage.questions) {
                    if (question.type === "tfng" && answers[question.id] === "NOT_GIVEN") {
                        answers[question.id] = "NOT GIVEN";
                    }
                }

                const draft = draftStore.save(userId, {
                    passageId,
                    attemptId: attempt.id,
                    startedAt: attempt.startedAt,
                    endsAt: attempt.endsAt,
                    serverOffsetMs: computeOffset(attempt.serverNow),
                    answers,
                    currentIndex: restorable
                        ? Math.min(Math.max(restorable.currentIndex, 0), lastIndex)
                        : 0,
                    mobileTab: restorable?.mobileTab ?? "passage",
                    status: "in_progress",
                    idempotencyKey: restorable?.idempotencyKey,
                    recoveryAttemptId: restorable?.recoveryAttemptId,
                });

                draftRef.current = draft;
                dispatch({
                    type: "loaded",
                    passage,
                    attempt,
                    draft,
                    storageOk: draftStore.isAvailable(),
                });
            })
            .catch((error: unknown) => {
                if (error instanceof ApiError && error.status === 401) {
                    router.push(loginUrl(pathname));
                    return;
                }
                dispatch({ type: "phase", phase: { kind: "error" } });
            });
    }, [authLoading, userId, nonce, passageId, router, pathname, startAttempt]);

    const commit = useCallback(
        (patch: Partial<DraftInput>) => {
            const current = draftRef.current;
            if (!current || !userId) return;
            const saved = draftStore.save(userId, { ...current, ...patch });
            draftRef.current = saved;
            dispatch({ type: "draft", draft: saved });
        },
        [userId],
    );

    const runSubmit = useCallback(
        async (reason: SubmitReason) => {
            if (!userId || submittingRef.current) return;
            const base = draftStore.get(userId, passageId) ?? draftRef.current;
            if (!base) return;

            submittingRef.current = true;
            draftRef.current = base;
            dispatch({ type: "phase", phase: { kind: "submitting", reason } });

            try {
                const result = await submitMutation({ draft: base, userId });
                router.replace(READING_PATHS.result(passageId, result.attemptId));
            } catch (error) {
                submittingRef.current = false;
                const latest = draftStore.get(userId, passageId);
                if (latest) {
                    draftRef.current = latest;
                    dispatch({ type: "draft", draft: latest });
                }
                dispatch({
                    type: "phase",
                    phase:
                        error instanceof SessionExpiredError
                            ? { kind: "sessionExpired" }
                            : { kind: "failed", reason },
                });
            }
        },
        [userId, passageId, submitMutation, router],
    );

    const onTimeUp = useCallback(() => {
        const kind = phaseRef.current.kind;
        if (kind === "submitting") return;
        if (kind === "sessionExpired") {
            commit({ status: "pending_submit" });
            return;
        }
        void runSubmit("timeup");
    }, [commit, runSubmit]);

    const timerEnabled =
        state.attempt !== null && state.phase.kind !== "loading" && state.phase.kind !== "error";

    const remainingSeconds = useAttemptTimer({
        endsAt: state.draft?.endsAt ?? null,
        offsetMs: state.draft?.serverOffsetMs ?? 0,
        enabled: timerEnabled,
        onTimeUp,
    });

    const questions = state.passage?.questions ?? [];
    const answers = state.draft?.answers ?? {};
    const answeredCount = questions.filter((question) => answers[question.id]?.trim()).length;
    const phaseKind = state.phase.kind;

    const setAnswer = useCallback(
        (questionId: string, value: string) => {
            if (phaseRef.current.kind !== "answering") return;
            const current = draftRef.current;
            if (!current) return;
            const next = { ...current.answers };
            if (value.trim()) next[questionId] = value;
            else delete next[questionId];
            commit({ answers: next });
        },
        [commit],
    );

    const goTo = useCallback(
        (index: number) => {
            if (phaseRef.current.kind !== "answering") return;
            const lastIndex = Math.max(0, (state.passage?.questions.length ?? 1) - 1);
            commit({ currentIndex: Math.min(Math.max(index, 0), lastIndex) });
        },
        [commit, state.passage],
    );

    const setTab = useCallback((tab: MobileTab) => commit({ mobileTab: tab }), [commit]);

    const canReturnToTest =
        state.phase.kind === "failed" &&
        state.phase.reason === "manual" &&
        (remainingSeconds ?? 0) > 0;

    return {
        phase: state.phase,
        passage: state.passage,
        draft: state.draft,
        storageOk: state.storageOk,
        questions,
        answers,
        answeredCount,
        remainingSeconds,
        locked: phaseKind === "submitting",
        canReturnToTest,
        setAnswer,
        clearAnswer: (questionId: string) => setAnswer(questionId, ""),
        goTo,
        next: () => goTo((state.draft?.currentIndex ?? 0) + 1),
        prev: () => goTo((state.draft?.currentIndex ?? 0) - 1),
        setTab,
        openConfirm: () => {
            if (phaseRef.current.kind === "answering") {
                dispatch({ type: "phase", phase: { kind: "confirming" } });
            }
        },
        openLeave: () => {
            if (phaseRef.current.kind === "answering") {
                dispatch({ type: "phase", phase: { kind: "leaving" } });
            }
        },
        closeDialog: () => dispatch({ type: "phase", phase: { kind: "answering" } }),
        confirmSubmit: () => void runSubmit("manual"),
        leave: () => router.push(READING_PATHS.LIST),
        retrySubmit: () => {
            const reason = phaseRef.current.kind === "failed" ? phaseRef.current.reason : "manual";
            void runSubmit(reason);
        },
        backFromFailed: () => {
            if (canReturnToTest) {
                commit({ status: "in_progress" });
                dispatch({ type: "phase", phase: { kind: "answering" } });
            } else {
                router.push(READING_PATHS.LIST);
            }
        },
        signIn: () => router.push(loginUrl(pathname)),
        retryLoad: () => {
            dispatch({ type: "phase", phase: { kind: "loading" } });
            setNonce((value) => value + 1);
        },
    };
}
