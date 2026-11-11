import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/shared/image-slot";
import { HERO } from "../constants/landing";
import { AuthCta } from "./auth-cta";

export function HeroSection() {
    return (
        <section aria-labelledby="hero-title" className="container-page">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
                <div className="flex w-full flex-col gap-[22px] lg:flex-1">
                    <span className="inline-flex self-start rounded-pill bg-primary-soft px-[10px] py-1 text-xs font-semibold text-primary">
                        {HERO.pill}
                    </span>
                    <h1 id="hero-title" className="text-display">
                        {HERO.titleLead}
                        <span className="text-primary">{HERO.titleAccent}</span>
                    </h1>
                    <p className="text-lead">{HERO.lead}</p>
                    <div className="flex flex-wrap gap-3">
                        <AuthCta content={HERO.cta} variant="gradient" />
                        <Button asChild variant="brand-outline">
                            <Link href={HERO.secondary.href}>{HERO.secondary.label}</Link>
                        </Button>
                    </div>
                    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-caption text-muted-foreground">
                        {HERO.reassurance.map((item) => (
                            <li key={item} className="flex items-center gap-1.5">
                                <Check aria-hidden className="size-[14px]" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative aspect-square w-80 max-w-full shrink-0 md:w-[420px] lg:w-[480px] xl:w-[560px]">
                    <ImageSlot
                        src={HERO.image.src}
                        alt={HERO.image.alt}
                        priority
                        sizes="(min-width: 1280px) 560px, (min-width: 1024px) 480px, (min-width: 768px) 420px, 320px"
                        className="rounded-frame"
                    />
                </div>
            </div>
        </section>
    );
}