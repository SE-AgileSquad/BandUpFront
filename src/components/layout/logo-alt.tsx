import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const letters = "BandUp".split("");

export function LogoAlt({ className }: { className?: string }) {
  return (
    <Link
      href={ROUTES.HOME}
      aria-label="BandUp home"
      className={cn(
        "inline-flex items-center gap-[10px] rounded-btn outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm bg-white md:size-10 p-2">
        <Image
          src="/images/BandUp_Logo_RAW.png"
          alt=""
          width={40}
          height={40}
          priority
          className="size-full object-contain"
        />
      </span>
      <span aria-hidden="true" className="inline-flex text-logo">
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            style={{ animationDelay: `${index * 80}ms` }}
            className={cn(
              "inline-flex text-2xl font-bold leading-none md:text-3xl motion-safe:animate-bandup-bounce",
              index < 4 ? "text-white" : "text-white",
            )}
          >
            {letter}
          </span>
        ))}
      </span>
    </Link>
  );
}
