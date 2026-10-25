import Link from "next/link";
import { Button } from "@/components/ui/button";
import CheckBadge from "./CheckBadge";
import ImageSlot from "./ImageSlot";
import type { StaticImageData } from "next/image";

type HeroProps = {
  image?: string | StaticImageData;
};

export default function Hero({ image }: HeroProps) {
  return (
    <section className="bg-background px-6 pb-12 pt-8 lg:px-[120px] lg:pb-24 lg:pt-[72px]">
      <div className="mx-auto grid w-full max-w-content gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent py-1.5 pl-2.5 pr-3.5">
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-small text-primary">
              For IELTS Academic · Reading and Writing
            </span>
          </div>

          <h1 className="text-hero-sm font-bold text-foreground lg:text-hero">
            Prepare for IELTS Reading and Writing — and learn from every
            mistake
          </h1>

          <p className="text-lead text-muted-foreground">
            BandUp doesn&apos;t just tell you what you got wrong. It shows you
            why, then brings each mistake back until you&apos;ve learned it.
          </p>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <Button asChild className="h-auto px-6 py-3 text-body font-medium">
              <Link href="/register" className="text-primary-foreground">Get started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto px-6 py-3 text-body font-medium"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>

          <ul className="flex items-center gap-4 lg:gap-6">
            {["Free to start", "3 free Writing credits"].map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <CheckBadge size={18} />
                <span className="text-small text-muted-foreground">
                  {perk}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-[420px] w-full lg:h-[548px]">
          <ImageSlot
            src={image}
            alt="BandUp review page"
            label="Hero image"
            priority
            className="h-[300px] w-full lg:h-[520px]"
          />

          <div className="absolute left-[23px] top-[230px] flex w-[296px] flex-col gap-3 rounded-2xl border border-border bg-card p-[18px] shadow-card lg:-left-9 lg:top-[343px] lg:w-[340px]">
            <div className="flex items-center justify-between gap-2">
              <span className="flex-1 text-caption text-muted-foreground">
                Question 3 · True / False / Not Given
              </span>
              <span className="shrink-0 whitespace-nowrap rounded-full bg-destructive-bg px-2.5 py-[3px] text-caption text-destructive">
                ✕ Incorrect
              </span>
            </div>

            <p className="text-body font-medium text-foreground">
              Researchers started the project in 2019.
            </p>

            <div className="flex flex-col gap-1.5">
              <span className="text-caption text-muted-foreground">
                Evidence sentence
              </span>
              <p className="border-l-[3px] border-highlight-border bg-highlight px-3 py-2 text-body text-highlight-foreground">
                The study began in the spring of 2019.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-caption text-muted-foreground">
                Paraphrase
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-[3px] text-caption text-secondary-foreground">
                started ⇄ began
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}