"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OtpChallenge } from "@/types/auth";
import type { LoginMethod } from "../types";

type LoginFlowData = {
    method: LoginMethod;
    email: string;
    challenge: OtpChallenge | null;
};

type LoginFlowState = LoginFlowData & {
    setMethod: (method: LoginMethod) => void;
    setEmail: (email: string) => void;
    startChallenge: (email: string, challenge: OtpChallenge) => void;
    updateTimers: (
        timers: Partial<Pick<OtpChallenge, "expiresAt" | "resendAvailableAt">>,
    ) => void;
    setLockedUntil: (lockedUntil: number | null) => void;
    reset: () => void;
};

const initialState: LoginFlowData = {
    method: "password",
    email: "",
    challenge: null,
};

export const useLoginFlow = create<LoginFlowState>()(
    persist(
        (set) => ({
            ...initialState,
            setMethod: (method) => set({ method }),
            setEmail: (email) => set({ email }),
            startChallenge: (email, challenge) =>
                set({ method: "email", email, challenge }),
            updateTimers: (timers) =>
                set((state) =>
                    state.challenge ? { challenge: { ...state.challenge, ...timers } } : {},
                ),
            setLockedUntil: (lockedUntil) =>
                set((state) =>
                    state.challenge ? { challenge: { ...state.challenge, lockedUntil } } : {},
                ),
            reset: () => set(initialState),
        }),
        {
            name: "bandup-login-flow-v2",
            storage: createJSONStorage(() => sessionStorage),
            skipHydration: true,
            partialize: (state) => ({
                method: state.method,
                email: state.email,
                challenge: state.challenge,
            }),
        },
    ),
);

export function useLoginFlowReady() {
    const [ready, setReady] = useState(() => useLoginFlow.persist.hasHydrated());

    useEffect(() => {
        let active = true;
        Promise.resolve(useLoginFlow.persist.rehydrate()).then(() => {
            if (active) setReady(true);
        });
        return () => {
            active = false;
        };
    }, []);

    return ready;
}
