const pad = (value: number) => String(value).padStart(2, "0");

export function formatClock(totalSeconds: number) {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
}

export function formatClockFromMs(ms: number) {
    return formatClock(Math.ceil(ms / 1000));
}