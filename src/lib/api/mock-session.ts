import type { AuthUser } from "@/types/auth";

const KEY = "bandup-mock-session";

let cached: AuthUser | null | undefined;

function read(): AuthUser | null {
    if (cached !== undefined) return cached;
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem(KEY);
        cached = raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
        cached = null;
    }
    return cached;
}

export const mockSession = {
    get: read,
    set(user: AuthUser | null) {
        cached = user;
        try {
            if (user) window.sessionStorage.setItem(KEY, JSON.stringify(user));
            else window.sessionStorage.removeItem(KEY);
        } catch {
            // storage unavailable
        }
    },
};