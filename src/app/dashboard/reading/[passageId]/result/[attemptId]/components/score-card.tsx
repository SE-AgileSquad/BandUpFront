import { ImageSlot } from "@/components/shared/image-slot";
import type { ResultPayload } from "@/app/dashboard/reading/_shared/types";
import { RESULT_COPY } from "../constants/result";

export function ScoreCard({ result }: { result: ResultPayload }) {
    return (
        <section
            aria-labelledby="score-headline"
            className="flex flex-1 flex-col items-center justify-center gap-3 rounded-banner bg-gradient-primary p-10 text-center text-primary-foreground"
        >
            <div className="relative size-[200px]">
                <ImageSlot
                    src={undefined}
                    alt={RESULT_COPY.trophyAlt}
                    sizes="200px"
                    className="rounded-frame"
                />
            </div>
            <h2 id="score-headline" className="text-[24px] leading-[32px] font-bold">
                {result.headline || RESULT_COPY.defaultHeadline}
            </h2>
            <p className="text-score">
                {result.correct} / {result.total}
            </p>
            <p className="text-[16px] leading-[24px]">{RESULT_COPY.band(result.band)}</p>
            <p className="text-[12px] leading-[1.4] opacity-80">{RESULT_COPY.disclaimer}</p>
        </section>
    );
}