"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitAttempt } from "../lib/submit-attempt";
import { readingApi } from "./index";

export const queryKeys = {
    passages: ["reading", "passages"] as const,
    result: (attemptId: string) => ["reading", "result", attemptId] as const,
};

export function usePassagesQuery() {
    return useQuery({
        queryKey: queryKeys.passages,
        queryFn: () => readingApi.listPassages(),
        select: (data) => data.items,
        refetchOnMount: "always",
    });
}

export function useStartAttemptMutation() {
    return useMutation({
        mutationKey: ["reading", "start"],
        mutationFn: (passageId: string) => readingApi.startAttempt(passageId),
    });
}

export function useUpdateAnswerMutation() {
    return useMutation({
        mutationKey: ["reading", "answer"],
        retry: 2,
        mutationFn: (input: { attemptId: string; questionId: string; selectedAnswer: string }) =>
            readingApi.updateAnswer(input.attemptId, input.questionId, input.selectedAnswer),
    });
}

export function useSubmitAttemptMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["reading", "submit"],
        retry: 0,
        mutationFn: (input: { attemptId: string; answers: Record<string, string>; idempotencyKey: string }) =>
            submitAttempt(input),
        onSuccess: (result) => {
            queryClient.setQueryData(queryKeys.result(result.attemptId), result);
            void queryClient.invalidateQueries({ queryKey: queryKeys.passages });
        },
    });
}

export function useResultQuery(attemptId: string) {
    return useQuery({
        queryKey: queryKeys.result(attemptId),
        queryFn: () => readingApi.getResult(attemptId),
        staleTime: Infinity,
    });
}
