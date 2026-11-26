"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { VerificationSession } from "../types";

type RegisterFlowState = {
    session: VerificationSession | null;
    verified: boolean;
    startVerification: (session: VerificationSession) => void;
    updateTimers: (
        timers: Partial<Pick<VerificationSession, "expiresAt" | "resendAvailableAt">>,
    ) => void;
    setLockedUntil: (lockedUntil: number | null) => void;
    markVerified: () => void;
    reset: () => void;
};

const initialState = { session: null, verified: false };

export const useRegisterFlow = create<RegisterFlowState>()(
    persist(
        (set) => ({
            ...initialState,
            startVerification: (session) => set({ session, verified: false }),
            updateTimers: (timers) =>
                set((state) =>
                    state.session ? { session: { ...state.session, ...timers } } : {},
                ),
            setLockedUntil: (lockedUntil) =>
                set((state) =>
                    state.session ? { session: { ...state.session, lockedUntil } } : {},
                ),
            markVerified: () => set({ verified: true }),
            reset: () => set(initialState),
        }),
        {
            name: "bandup-register-flow-v2",
            storage: createJSONStorage(() => sessionStorage),
            skipHydration: true,
            partialize: (state) => ({
                session: state.session,
                verified: state.verified,
            }),
        },
    ),
);

export function useRegisterFlowReady() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.resolve(useRegisterFlow.persist?.rehydrate()).then(() => {
            if (active) setReady(true);
        });
        return () => {
            active = false;
        };
    }, []);

    return ready;
}
