import type { Metadata } from "next";
import { AdminGate, AdminShell } from "./_components/shell";

export const metadata: Metadata = { title: "Admin workspace", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminGate><AdminShell>{children}</AdminShell></AdminGate>;
}
