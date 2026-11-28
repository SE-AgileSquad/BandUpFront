export function getLoopbackApiUrl(value: string | undefined): URL | null {
    if (!value) return null;

    try {
        const url = new URL(value);
        if (
            (url.protocol === "http:" || url.protocol === "https:") &&
            ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
            url.pathname === "/" && !url.username && !url.password && !url.search && !url.hash
        ) {
            return url;
        }
    } catch {
        return null;
    }

    return null;
}
