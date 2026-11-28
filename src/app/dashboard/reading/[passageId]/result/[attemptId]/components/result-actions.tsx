import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import type { ResultPayload } from "@/app/dashboard/reading/_shared/types";
import { Button } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/constants/routes";
import { RESULT_COPY } from "../constants/result";

type ResultActionsProps = { result: ResultPayload; passageId: string; attemptId: string };

export function ResultActions({ result, passageId, attemptId }: ResultActionsProps) {
    const lesson = result.suggestedLesson;

    return (
        <div className="flex flex-col gap-3">
            {lesson && (
                lesson.href ? (
                    <Link
                        href={lesson.href}
                        className="flex min-h-[68px] items-center gap-3 rounded-frame bg-warning-soft px-4 py-3 text-warning-soft-foreground outline-none transition-colors hover:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <BookOpen aria-hidden className="size-7 shrink-0" strokeWidth={1.8} />
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-[13px] leading-5 font-semibold">{RESULT_COPY.suggestedLesson}</span>
                            <span className="text-[15px] leading-5 font-bold text-foreground">{RESULT_COPY.lesson(lesson.title)}</span>
                        </span>
                        <ChevronRight aria-hidden className="size-5 shrink-0" />
                    </Link>
                ) : (
                    <div className="flex min-h-[68px] items-center gap-3 rounded-frame bg-warning-soft px-4 py-3 text-warning-soft-foreground">
                        <BookOpen aria-hidden className="size-7 shrink-0" strokeWidth={1.8} />
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="text-[13px] leading-5 font-semibold">{RESULT_COPY.suggestedLesson}</span>
                            <span className="text-[15px] leading-5 font-bold text-foreground">{RESULT_COPY.lesson(lesson.title)}</span>
                        </span>
                    </div>
                )
            )}

            <Button asChild variant="gradient" size="default" className="w-full">
                <Link href={READING_PATHS.review(passageId, attemptId)}>{RESULT_COPY.review}</Link>
            </Button>

            <Button asChild variant="brand-outline" size="default" className="w-full border-primary/70">
                <Link href={DASHBOARD_ROUTES.PARAPHRASE}>{RESULT_COPY.paraphrase}</Link>
            </Button>

            <Link
                href={READING_PATHS.LIST}
                className="self-center rounded-sm px-2 py-1 text-[14px] leading-[21px] font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
                {RESULT_COPY.another}
            </Link>
        </div>
    );
}
