import type { Passage } from "@/app/dashboard/reading/_shared/types";
import { TEST_COPY } from "../constants/test";

export function PassagePanel({ passage }: { passage: Passage }) {
    return (
        <article className="flex flex-col gap-[14px] rounded-card bg-passage p-5 lg:p-7">
            <span className="inline-flex self-start rounded-pill bg-primary-soft px-[10px] py-1 text-[11px] leading-[1.4] font-bold text-primary uppercase">
                {passage.eyebrow}
            </span>
            <h1 className="text-[22px] leading-[30px] font-bold lg:text-[26px] lg:leading-[34px]">
                {passage.title}
            </h1>
            {passage.paragraphs.map((paragraph) => (
                <p key={paragraph.label} className="text-[17px] leading-[28px] text-foreground">
                    <span className="font-semibold">{paragraph.label}.</span> {paragraph.text}
                </p>
            ))}
            <p className="text-[12px] leading-[1.4] text-muted-foreground">
                {TEST_COPY.passage.footer(passage.questions.length)}
            </p>
        </article>
    );
}