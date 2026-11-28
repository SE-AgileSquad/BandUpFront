import { ROUTES } from "@/constants/routes";

export function loginUrl(next: string) {
  const params = new URLSearchParams({ next, reason: "session-expired" });
  return `${ROUTES.LOGIN}?${params.toString()}`;
}