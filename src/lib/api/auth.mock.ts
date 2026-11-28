import { mockSession } from "@/lib/mock-session";

export async function mockLogout() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  mockSession.set(null);
}