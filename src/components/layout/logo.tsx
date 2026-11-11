import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.HOME}
      aria-label="BandUp home"
      className={cn(
        "inline-flex items-center gap-[10px] rounded-btn outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-10 place-items-center rounded-logo bg-primary text-[22px] leading-none font-bold text-primary-foreground"
      >
        B
      </span>
      <span className="text-logo text-foreground">BandUp</span>
    </Link>
  );
}