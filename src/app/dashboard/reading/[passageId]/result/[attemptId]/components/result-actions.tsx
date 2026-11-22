import Link from "next/link";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import type { ResultPayload } from "@/app/dashboard/reading/_shared/types";
import { Button } from "@/components/ui/button";
import { DASHBOARD_ROUTES } from "@/constants/routes";
import { RESULT_COPY } from "../constants/result";

type ResultActionsProps = { result: ResultPayload; passageId: string; attemptId: string };

const chipClass =
    "rounded-card bg-warning-soft px-4 py-3 text-[13px] leading-[1.4] font-semibold text-warning-soft-foreground";

export function ResultActions({ result, passageId, attemptId }: ResultActionsProps) {
    const lesson = result.suggestedLesson;

    return (
        <div className="flex flex-col gap-3">
            <Button asChild variant="gradient" size="default" className="w-full">
                <Link href={READING_PATHS.review(passageId, attemptId)}>{RESULT_COPY.review}</Link>
            </Button>

            {lesson &&
                (lesson.href ? (
                    <Link
                        href={lesson.href}
                        className={`${chipClass} outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                    >
                        {RESULT_COPY.lesson(lesson.title)}
                    </Link>
                ) : (
                    <p className={chipClass}>{RESULT_COPY.lesson(lesson.title)}</p>
                ))}

            {result.newParaphraseCount !== undefined && (
                <Button asChild variant="brand-outline" size="default" className="w-full">
                    <Link href={DASHBOARD_ROUTES.PARAPHRASE}>
                        {RESULT_COPY.paraphrase(result.newParaphraseCount)}
                    </Link>
                </Button>
            )}

            <Link
                href={READING_PATHS.LIST}
                className="self-center rounded-sm text-[14px] leading-[21px] font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
                {RESULT_COPY.another}
            </Link>
        </div>
    );
}