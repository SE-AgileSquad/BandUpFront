import { DRAFT_KEY_PREFIX, DRAFT_VERSION } from "../constants/reading";
import { remainingMs } from "../lib/clock";
import type { Answers, Draft, DraftInput } from "../types";

const CHANGE_EVENT = "bandup:reading:drafts";
const memory = new Map<string, Draft>();
let available: boolean | undefined;

const keyFor = (userId: string, passageId: string) =>
    `${DRAFT_KEY_PREFIX}:${userId}:${passageId}`;

function fnv1a(input: string) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16);
}

function computeChecksum(attemptId: string, answers: Answers) {
    const body = Object.keys(answers)
        .sort()
        .map((key) => `${key}=${answers[key]}`)
        .join("&");
    return fnv1a(`${attemptId}|${body}`);
}

function getStorage(): Storage | null {
    if (typeof window === "undefined" || available === false) return null;
    try {
        const storage = window.localStorage;
        if (available === undefined) {
            const probe = `${DRAFT_KEY_PREFIX}:probe`;
            storage.setItem(probe, "1");
            storage.removeItem(probe);
            available = true;
        }
        return storage;
    } catch {
        available = false;
        return null;
    }
}

function parse(raw: string | null): Draft | null {
    if (!raw) return null;
    try {
        const data = JSON.parse(raw) as Partial<Draft> | null;
        if (
            !data ||
            data.v !== DRAFT_VERSION ||
            typeof data.passageId !== "string" ||
            typeof data.attemptId !== "string" ||
            typeof data.endsAt !== "string" ||
            typeof data.serverOffsetMs !== "number" ||
            (data.status !== "in_progress" && data.status !== "pending_submit") ||
            !data.answers ||
            typeof data.answers !== "object"
        ) {
            return null;
        }
        for (const value of Object.values(data.answers)) {
            if (typeof value !== "string") return null;
        }
        if (data.checksum !== computeChecksum(data.attemptId, data.answers)) return null;
        return data as Draft;
    } catch {
        return null;
    }
}

function emit() {
    if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGE_EVENT));
}

export const draftStore = {
    isAvailable() {
        return getStorage() !== null;
    },

    get(userId: string, passageId: string): Draft | null {
        const key = keyFor(userId, passageId);
        const storage = getStorage();
        if (!storage) return memory.get(key) ?? null;
        try {
            return parse(storage.getItem(key));
        } catch {
            return null;
        }
    },

    save(userId: string, input: DraftInput): Draft {
        const draft: Draft = {
            ...input,
            v: DRAFT_VERSION,
            savedAt: Date.now(),
            checksum: computeChecksum(input.attemptId, input.answers),
        };
        const key = keyFor(userId, input.passageId);
        memory.set(key, draft);
        try {
            getStorage()?.setItem(key, JSON.stringify(draft));
        } catch {
            // quota or blocked: the in-memory copy still holds the draft
        }
        emit();
        return draft;
    },

    remove(userId: string, passageId: string) {
        const key = keyFor(userId, passageId);
        memory.delete(key);
        try {
            getStorage()?.removeItem(key);
        } catch {
            // ignore
        }
        emit();
    },

    listForUser(userId: string): Draft[] {
        const prefix = `${DRAFT_KEY_PREFIX}:${userId}:`;
        const storage = getStorage();
        if (!storage) {
            return [...memory.entries()]
                .filter(([key]) => key.startsWith(prefix))
                .map(([, draft]) => draft);
        }
        const drafts: Draft[] = [];
        try {
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (!key?.startsWith(prefix)) continue;
                const draft = parse(storage.getItem(key));
                if (draft) drafts.push(draft);
            }
        } catch {
            // ignore
        }
        return drafts;
    },

    subscribe(callback: () => void) {
        const onStorage = (event: StorageEvent) => {
            if (event.key === null || event.key.startsWith(DRAFT_KEY_PREFIX)) callback();
        };
        window.addEventListener("storage", onStorage);
        window.addEventListener(CHANGE_EVENT, callback);
        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener(CHANGE_EVENT, callback);
        };
    },

    needsSubmit(draft: Draft, now = Date.now()) {
        return (
            draft.status === "pending_submit" ||
            remainingMs(draft.endsAt, draft.serverOffsetMs, now) <= 0
        );
    },
};