import { User } from "lucide-react";
import Link from "next/link";

export default function DashboardLink() {
  return (
    <Link
      href="/dashboard"
      aria-label="Go to dashboard"
      className="flex h-10 items-center gap-2 rounded-lg border border-border px-2 text-body font-medium text-foreground transition-colors hover:bg-muted md:px-3"
    >
      <span className="flex size-4 items-center justify-center rounded-full">
        <User className="size-4" aria-hidden="true" />
      </span>
      <span className="hidden md:inline">Dashboard</span>
    </Link>
  );
}