// Mock. Replace with GET /api/v1/users/me (via apiFetch) later; keep the return type.
import { z } from "zod";

import { mockNewUser, mockReturningUser } from "../mocks/mock-users";
import type {
    CurrentUserData,
    DashboardUserState,
} from "../types/dashboard.types";
import {
    DEFAULT_MOCK_STATE,
    MOCK_LATENCY_MS,
    MOCK_STATE_STORAGE_KEY
} from "../constants/dashboard.constants";

const mockStateSchema = z.enum(["new", "returning"]);

const FIXTURES: Record<DashboardUserState, CurrentUserData> = {
    new: mockNewUser,
    returning: mockReturningUser,
};

export function readMockUserState(): DashboardUserState {
    if (typeof window === "undefined") {
        return DEFAULT_MOCK_STATE;
    }

    try {
        const parsed = mockStateSchema.safeParse(
            window.localStorage.getItem(MOCK_STATE_STORAGE_KEY),
        );
        return parsed.success ? parsed.data : DEFAULT_MOCK_STATE;
    } catch {
        return DEFAULT_MOCK_STATE;
    }
}

export function writeMockUserState(state: DashboardUserState): void {
    try {
        window.localStorage.setItem(MOCK_STATE_STORAGE_KEY, state);
    } catch {
        return;
    }
}

export async function getCurrentUser(): Promise<CurrentUserData> {
    await new Promise<void>((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
    return FIXTURES[readMockUserState()];
}