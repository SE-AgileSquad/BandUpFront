"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OtpChallenge } from "@/types/auth";

type ForgotFlowData = {
    email: string;
    challenge: ForgotChallenge | null;
    newPassword: string | null;
    passwordError: string | null;
    completed: boolean;
    completedMaskedEmail: string;
};

export type ForgotChallenge = Pick<
    OtpChallenge,
    "maskedEmail" | "expiresAt" | "resendAvailableAt" | "lockedUntil"
>;

type ForgotFlowState = ForgotFlowData & {
    setEmail: (email: string) => void;
    startChallenge: (email: string, challenge: ForgotChallenge) => void;
    setNewPassword: (password: string | null) => void;
    setPasswordError: (message: string | null) => void;
    updateTimers: (
        timers: Partial<Pick<OtpChallenge, "expiresAt" | "resendAvailableAt">>,
    ) => void;
    setLockedUntil: (lockedUntil: number | null) => void;
    clearChallenge: () => void;
    complete: (maskedEmail: string) => void;
    reset: () => void;
};

const initialState: ForgotFlowData = {
    email: "",
    challenge: null,
    newPassword: null,
    passwordError: null,
    completed: false,
    completedMaskedEmail: "",
};

export const useForgotFlow = create<ForgotFlowState>()(
    persist(
        (set) => ({
            ...initialState,
            setEmail: (email) =>
                set({ email, challenge: null, newPassword: null, passwordError: null }),
            startChallenge: (email, challenge) =>
                set({ email, challenge, newPassword: null, passwordError: null }),
            setNewPassword: (newPassword) => set({ newPassword }),
            setPasswordError: (passwordError) => set({ passwordError }),
            updateTimers: (timers) =>
                set((state) =>
                    state.challenge ? { challenge: { ...state.challenge, ...timers } } : {},
                ),
            setLockedUntil: (lockedUntil) =>
                set((state) =>
                    state.challenge ? { challenge: { ...state.challenge, lockedUntil } } : {},
                ),
            clearChallenge: () =>
                set({ challenge: null, newPassword: null, passwordError: null }),
            complete: (completedMaskedEmail) =>
                set({
                    ...initialState,
                    completed: true,
                    completedMaskedEmail,
                }),
            reset: () => set(initialState),
        }),
        {
            name: "bandup-forgot-flow",
            storage: createJSONStorage(() => sessionStorage),
            skipHydration: true,
            partialize: (state) => ({
                email: state.email,
                challenge: state.challenge,
            }),
        },
    ),
);

export function useForgotFlowReady() {
    // Persist middleware has no storage API during server rendering because
    // sessionStorage is only available in the browser. Start consistently on
    // the server and hydrate from sessionStorage after mount.
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;
        Promise.resolve(useForgotFlow.persist.rehydrate()).then(() => {
            if (active) setReady(true);
        });
        return () => {
            active = false;
        };
    }, []);

    return ready;
}
