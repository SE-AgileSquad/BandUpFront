"use client";

import { useCallback, useEffect, useState } from "react";
import { MS_PER_SECOND } from "../constants/auth.constants";
import type { VerificationEntry } from "../types/auth.types";
import {
    clearStoredFlow,
    readStoredFlow,
    writeStoredFlow,
} from "../utils/sign-up-storage";

type Step = "form" | "verify" | "verified";

interface FlowState {
    step: Step;
    email: string;
    displayName: string;
    resendEndsAt: number | null;
}

const INITIAL_STATE: FlowState = {
    step: "form",
    email: "",
    displayName: "",
    resendEndsAt: null,
};

export function useSignUpFlow() {
    const [state, setState] = useState<FlowState>(INITIAL_STATE);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const stored = readStoredFlow();
        if (stored) {
            setState({
                ...INITIAL_STATE,
                step: "verify",
                email: stored.email,
                resendEndsAt: stored.resendEndsAt,
            });
        }
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (state.step === "verify" && state.resendEndsAt !== null) {
            writeStoredFlow({ email: state.email, resendEndsAt: state.resendEndsAt });
        }
    }, [state]);

    const startVerification = useCallback(
        ({ email, displayName, cooldownSeconds }: VerificationEntry) => {
            setState({
                step: "verify",
                email,
                displayName,
                resendEndsAt: Date.now() + cooldownSeconds * MS_PER_SECOND,
            });
        },
        [],
    );

    const updateResendEndsAt = useCallback((resendEndsAt: number) => {
        setState((previous) => ({ ...previous, resendEndsAt }));
    }, []);

    const changeEmail = useCallback(() => {
        clearStoredFlow();
        setState((previous) => ({
            ...INITIAL_STATE,
            email: previous.email,
            displayName: previous.displayName,
        }));
    }, []);

    const markVerified = useCallback(() => {
        clearStoredFlow();
        setState((previous) => ({ ...previous, step: "verified" }));
    }, []);

    return {
        ...state,
        isReady,
        startVerification,
        updateResendEndsAt,
        changeEmail,
        markVerified,
    };
}