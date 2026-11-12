"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OtpChallenge } from "@/types/auth";
import type { LoginMethod } from "../types";

type LoginFlowData = {
    method: LoginMethod;
    phone: string;
    challenge: OtpChallenge | null;
};

type LoginFlowState = LoginFlowData & {
    setMethod: (method: LoginMethod) => void;
    setPhone: (phone: string) => void;
    startChallenge: (phone: string, challenge: OtpChallenge) => void;
    updateTimers: (
        timers: Partial<Pick<OtpChallenge, "expiresAt" | "resendAvailableAt">>,
    ) => void;
    setLockedUntil: (lockedUntil: number | null) => void;
    reset: () => void;
};

const initialState: LoginFlowData = {
    method: "password",
    phone: "",
    challenge: null,
};

export const useLoginFlow = create<LoginFlowState>()(
    persist(
        (set) => ({
            ...initialState,
            setMethod: (method) => set({ method }),
            setPhone: (phone) => set({ phone }),
            startChallenge: (phone, challenge) =>
                set({ method: "sms", phone, challenge }),
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
            name: "bandup-login-flow",
            storage: createJSONStorage(() => sessionStorage),
            skipHydration: true,
            partialize: (state) => ({
                method: state.method,
                phone: state.phone,
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