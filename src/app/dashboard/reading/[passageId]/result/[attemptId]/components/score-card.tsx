import { BarChart3, CircleCheck, Star, Target } from "lucide-react";
import { ImageSlot } from "@/components/shared/image-slot";
import type { ResultPayload } from "@/app/dashboard/reading/_shared/types";
import { RESULT_COPY } from "../constants/result";

function mascotForPercentage(percentage: number) {
    if (percentage >= 70) return "/images/result/img_happy.png";
    if (percentage >= 40) return "/images/result/img_normal.png";
    return "/images/result/img_sad.png";
}

export function ScoreCard({ result }: { result: ResultPayload }) {
    const ratio = result.total > 0 ? result.correct / result.total : 0;
    const accuracy = Math.round(ratio * 100);
    const illuminatedStars = accuracy >= 70 ? 3 : accuracy >= 40 ? 2 : 1;
    const answered = result.answered ?? result.breakdown.reduce((sum, item) => sum + item.total, 0);

    return (
        <section
            aria-label={`${result.correct} of ${result.total}, ${RESULT_COPY.band(result.band)}`}
            className="relative isolate mx-auto aspect-square w-full max-w-[500px] overflow-visible rounded-full border-[5px] border-primary/25 bg-[radial-gradient(circle_at_50%_40%,var(--color-card)_0%,var(--color-primary-soft)_60%,var(--color-background)_100%)] shadow-[0_24px_70px_-38px_var(--color-primary)]"
        >
            <div aria-hidden className="pointer-events-none absolute inset-[8px] rounded-full border border-primary/20" />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,transparent_42%,var(--color-primary-soft)_100%)] opacity-60" />

            <div aria-hidden className="absolute inset-x-0 top-[6%] flex items-start justify-center">
                <Star className={`absolute left-[17%] top-[3%] size-13 -rotate-12 animate-result-star drop-shadow-md motion-reduce:animate-none sm:size-14 [animation-delay:120ms] ${illuminatedStars >= 2 ? "fill-warning text-warning" : "fill-card text-primary/30"}`} />
                <Star className={`relative z-10 size-[72px] -translate-y-[56px] animate-result-star drop-shadow-lg motion-reduce:animate-none sm:size-[84px] sm:-translate-y-[72px] ${illuminatedStars >= 1 ? "fill-warning text-warning" : "fill-card text-primary/30"}`} />
                <Star className={`absolute right-[17%] top-[3%] size-13 rotate-12 animate-result-star drop-shadow-md motion-reduce:animate-none sm:size-14 [animation-delay:240ms] ${illuminatedStars >= 3 ? "fill-warning text-warning" : "fill-card text-primary/30"}`} />
            </div>

            <div className="absolute inset-x-0 top-[17%] mx-auto aspect-square w-[35%] max-w-[190px]">
                <ImageSlot
                    src={mascotForPercentage(accuracy)}
                    alt={RESULT_COPY.mascotAlt}
                    sizes="(min-width: 640px) 160px, 34vw"
                    className="drop-shadow-md"
                />
            </div>

            <div className="absolute inset-x-0 top-[53%] flex flex-col items-center text-center text-foreground">
                <p className="text-[clamp(1.75rem,7vw,4rem)] leading-none font-bold tracking-tight">
                    {result.correct} / {result.total}
                </p>
                <p className="mt-1 text-[clamp(1rem,3vw,1.5rem)] leading-tight font-semibold">
                    {RESULT_COPY.band(result.band)}
                </p>
                {result.band !== null && <p className="mt-1 text-[11px] leading-4 text-muted-foreground sm:text-xs">
                    {RESULT_COPY.disclaimer}
                </p>}
            </div>

            <div className="absolute inset-x-[8%] bottom-[5%] grid grid-cols-3 rounded-pill border border-primary/10 bg-card/75 px-1 py-2 text-center shadow-sm backdrop-blur-sm sm:inset-x-[12%] sm:px-2 sm:py-2.5">
                <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-foreground">
                    <Target aria-hidden className="size-[18px] text-primary sm:size-5" />
                    <span className="text-base leading-5 font-bold sm:text-lg">{accuracy}%</span>
                    <span className="text-[9px] leading-3 text-muted-foreground sm:text-[11px] sm:leading-4">{RESULT_COPY.accuracy}</span>
                </div>
                <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 border-x border-primary/20 px-1 text-foreground">
                    <CircleCheck aria-hidden className="size-[18px] text-primary sm:size-5" />
                    <span className="text-base leading-5 font-bold sm:text-lg">{answered}</span>
                    <span className="text-[9px] leading-3 text-muted-foreground sm:text-[11px] sm:leading-4">{RESULT_COPY.answered}</span>
                </div>
                <div className="flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-foreground">
                    <BarChart3 aria-hidden className="size-[18px] text-primary sm:size-5" />
                    <span className="text-base leading-5 font-bold sm:text-lg">{result.breakdown.length}</span>
                    <span className="text-[9px] leading-3 text-muted-foreground sm:text-[11px] sm:leading-4">{RESULT_COPY.skillsAssessed}</span>
                </div>
            </div>
        </section>
    );
}
