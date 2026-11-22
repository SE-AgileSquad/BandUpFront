"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSubmitAttemptMutation } from "@/app/dashboard/reading/_shared/api/reading.queries";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import { loginUrl } from "@/app/dashboard/reading/_shared/lib/login-url";
import { SessionExpiredError } from "@/app/dashboard/reading/_shared/lib/submit-attempt";
import { draftStore } from "@/app/dashboard/reading/_shared/storage/draft-store";
import { countAnswered } from "./use-list-items";

export type RecoveryState =
    | { kind: "idle" }
    | { kind: "submitting" }
    | { kind: "failed"; answered: number };

export function useRecovery(userId: string | null) {
    const router = useRouter();
    const submit = useSubmitAttemptMutation();
    const [state, setState] = useState<RecoveryState>({ kind: "idle" });
    const runningRef = useRef(false);
    const passageRef = useRef<string | null>(null);
    const { mutateAsync } = submit;

    const run = useCallback(
        async (passageId: string) => {
            if (!userId || runningRef.current) return;
            const draft = draftStore.get(userId, passageId);
            if (!draft) return;

            runningRef.current = true;
            passageRef.current = passageId;
            setState({ kind: "submitting" });

            try {
                const result = await mutateAsync({ draft, userId });
                router.push(READING_PATHS.result(passageId, result.attemptId));
            } catch (error) {
                runningRef.current = false;
                if (error instanceof SessionExpiredError) {
                    setState({ kind: "idle" });
                    router.push(loginUrl(READING_PATHS.recover(passageId)));
                    return;
                }
                const latest = draftStore.get(userId, passageId) ?? draft;
                setState({ kind: "failed", answered: countAnswered(latest.answers) });
            }
        },
        [userId, mutateAsync, router],
    );

    const retry = useCallback(() => {
        if (passageRef.current) void run(passageRef.current);
    }, [run]);

    const dismiss = useCallback(() => setState({ kind: "idle" }), []);

    return { state, run, retry, dismiss };
}