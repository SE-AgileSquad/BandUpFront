import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FinalCta() {
  return (
    <section className="bg-background px-6 py-14 lg:px-[120px] lg:py-24">
      <div className="relative mx-auto w-full max-w-content overflow-hidden rounded-3xl bg-primary px-6 py-10 lg:px-16 lg:py-[72px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[250px] top-[-120px] size-[360px] rounded-full bg-primary-foreground/[0.07] lg:left-[980px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[-60px] top-[200px] size-[260px] rounded-full bg-primary-foreground/[0.06] lg:left-[-90px] lg:top-[160px]"
        />

        <div className="relative flex flex-col items-center gap-5 text-center">
          <h2 className="text-h2-sm font-bold text-primary-foreground lg:text-h2">
            Ready to learn from your mistakes?
          </h2>
          <p className="text-lead text-primary-foreground/85">
            Create a free account and take your first Reading test in minutes.
          </p>
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <Button
              asChild
              variant="secondary"
              className="h-auto bg-secondary px-6 py-3 text-body font-medium text-secondary-foreground"
            >
              <Link href="/register">Get started</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-auto border border-primary-foreground px-6 py-3 text-body font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}