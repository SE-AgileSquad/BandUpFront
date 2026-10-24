"use client";

import { useCallback, useEffect, useState } from "react";
import {
  COUNTDOWN_TICK_MS,
  MS_PER_SECOND,
  SECONDS_PER_MINUTE,
} from "@/constants/auth.constants";

export interface CountdownApi {
  secondsLeft: number;
  isRunning: boolean;
  start: (seconds: number) => number;
  reset: () => void;
}

export function formatMmSs(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / SECONDS_PER_MINUTE);
  const seconds = safe % SECONDS_PER_MINUTE;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function secondsUntil(endsAt: number | null): number {
  if (endsAt === null) {
    return 0;
  }
  return Math.max(0, Math.ceil((endsAt - Date.now()) / MS_PER_SECOND));
}

export function useCountdown(initialEndsAt: number | null = null): CountdownApi {
  const [endsAt, setEndsAt] = useState<number | null>(initialEndsAt);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    secondsUntil(initialEndsAt),
  );

  useEffect(() => {
    if (endsAt === null) {
      return;
    }

    const update = () => {
      const remaining = secondsUntil(endsAt);
      setSecondsLeft(remaining);
      return remaining;
    };

    const intervalId = window.setInterval(() => {
      if (update() === 0) {
        window.clearInterval(intervalId);
      }
    }, COUNTDOWN_TICK_MS);

    update();

    return () => window.clearInterval(intervalId);
  }, [endsAt]);

  const start = useCallback((seconds: number) => {
    const nextEndsAt = Date.now() + seconds * MS_PER_SECOND;
    setEndsAt(nextEndsAt);
    setSecondsLeft(seconds);
    return nextEndsAt;
  }, []);

  const reset = useCallback(() => {
    setEndsAt(null);
    setSecondsLeft(0);
  }, []);

  return { secondsLeft, isRunning: secondsLeft > 0, start, reset };
}