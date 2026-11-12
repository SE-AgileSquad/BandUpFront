const BLOCKED_PREFIXES = ["/login", "/register"];
const PLACEHOLDER_ORIGIN = "http://placeholder.invalid";

function hasUnsafeChars(value: string) {
    for (let i = 0; i < value.length; i++) {
        const code = value.charCodeAt(i);
        if (code <= 0x1f || code === 0x7f || code === 0x5c) return true;
    }
    return false;
}

export function sanitizeNextPath(value: unknown): string | null {
    if (typeof value !== "string") return null;
    if (value.length === 0 || value.length > 512) return null;
    if (!value.startsWith("/") || value.startsWith("//")) return null;
    if (hasUnsafeChars(value)) return null;

    let url: URL;
    try {
        url = new URL(value, PLACEHOLDER_ORIGIN);
    } catch {
        return null;
    }
    if (url.origin !== PLACEHOLDER_ORIGIN) return null;

    const path = url.pathname.toLowerCase();
    if (BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
        return null;
    }

    return value;
}

export function withParams(
    path: string,
    params: Record<string, string | null | undefined>,
) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value) search.set(key, value);
    }
    const query = search.toString();
    return query ? `${path}?${query}` : path;
}