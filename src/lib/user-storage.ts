import type { AuthUser } from "./auth";

const USER_STORAGE_KEY = "ib_user";

export function saveUser(user: AuthUser): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}
