"use client";

import { useResultQuery } from "@/app/dashboard/reading/_shared/api/reading.queries";
import { Button } from "@/components/ui/button";
import { RESULT_COPY } from "../constants/result";
import { BreakdownCard } from "./breakdown-card";
import { ResultActions } from "./result-actions";
import { ResultSkeleton } from "./result-skeleton";
import { ScoreCard } from "./score-card";

type ResultViewProps = { passageId: string; attemptId: string };

export function ResultView({ passageId, attemptId }: ResultViewProps) {
    const query = useResultQuery(attemptId);

    if (query.isPending) return <ResultSkeleton />;

    if (query.isError || !query.data) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-card px-6 py-12 text-center">
                <p className="text-[24px] leading-[32px] font-bold">{RESULT_COPY.error.title}</p>
                <p className="text-[14px] leading-[21px] text-muted-foreground">
                    {RESULT_COPY.error.text}
                </p>
                <Button type="button" variant="gradient" size="default" onClick={() => void query.refetch()}>
                    {RESULT_COPY.error.retry}
                </Button>
            </div>
        );
    }

    const result = query.data;

    return (
        <div className="grid min-w-0 grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)] lg:gap-8">
            <ScoreCard result={result} />
            <aside className="flex min-w-0 flex-col gap-5 rounded-card border border-border bg-card p-5 shadow-sm sm:p-7">
                <BreakdownCard items={result.breakdown} />
                <ResultActions result={result} passageId={passageId} attemptId={attemptId} />
            </aside>
        </div>
    );
}
