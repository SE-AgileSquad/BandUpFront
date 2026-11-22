export function computeOffset(serverNowIso: string, clientNow = Date.now()) {
    return Date.parse(serverNowIso) - clientNow;
}

export function remainingMs(endsAtIso: string, offsetMs: number, now = Date.now()) {
    return Date.parse(endsAtIso) - (now + offsetMs);
}