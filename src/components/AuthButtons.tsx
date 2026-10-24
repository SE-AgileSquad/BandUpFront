import Link from "next/link";

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="flex h-10 w-[75px] items-center justify-center rounded-lg bg-transparent text-body font-medium text-foreground md:w-20"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="hidden h-10 w-20 items-center justify-center rounded-lg bg-primary text-body font-medium text-primary-foreground md:flex"
      >
        Sign up
      </Link>
    </div>
  );
}