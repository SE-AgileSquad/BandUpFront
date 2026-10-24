import { SIGN_UP_STORAGE_KEY } from "@/constants/auth.constants";

export interface StoredFlow {
    email: string;
    resendEndsAt: number;
}

function isStoredFlow(value: unknown): value is StoredFlow {
    return (
        typeof value === "object" &&
        value !== null &&
        "email" in value &&
        "resendEndsAt" in value &&
        typeof value.email === "string" &&
        typeof value.resendEndsAt === "number"
    );
}

export function readStoredFlow(): StoredFlow | null {
    try {
        const raw = window.sessionStorage.getItem(SIGN_UP_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed: unknown = JSON.parse(raw);
        return isStoredFlow(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

export function writeStoredFlow(flow: StoredFlow): void {
    try {
        window.sessionStorage.setItem(SIGN_UP_STORAGE_KEY, JSON.stringify(flow));
    } catch {
        return;
    }
}

export function clearStoredFlow(): void {
    try {
        window.sessionStorage.removeItem(SIGN_UP_STORAGE_KEY);
    } catch {
        return;
    }
}