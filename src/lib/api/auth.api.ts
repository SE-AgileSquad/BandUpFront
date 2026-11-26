import { env } from "@/config/env";
import { api } from "@/lib/axios";
import { ApiError } from "@/types/api";
import { mockLogout } from "./auth.mock";

async function realLogout() {
    try {
        await api.post("/api/auth/logout", {});
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) return;
        throw error;
    }
}

export const logout = env.useMockApi ? mockLogout : realLogout;
