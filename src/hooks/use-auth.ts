"use client";

import { useSyncExternalStore } from "react";

const TOKEN_KEY = "access_token";

type AuthState = "loading" | "authenticated" | "guest";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): AuthState {
  try {
    return window.localStorage.getItem(TOKEN_KEY) ? "authenticated" : "guest";
  } catch {
    return "guest";
  }
}

function getServerSnapshot(): AuthState {
  return "loading";
}

export function useAuth(): { isAuthenticated: boolean; isLoading: boolean } {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    isAuthenticated: state === "authenticated",
    isLoading: state === "loading",
  };
}