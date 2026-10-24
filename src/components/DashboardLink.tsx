import Link from "next/link";

export default function DashboardLink() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="size-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
      </svg>
      <span>Go to dashboard</span>
    </Link>
  );
}