import { RESULT_COPY } from "../constants/result";

export function ResultSkeleton() {
    return (
        <div role="status" aria-busy="true" className="flex flex-col gap-5 lg:flex-row">
            <span className="sr-only">{RESULT_COPY.loading}</span>
            <div aria-hidden className="h-[420px] animate-pulse rounded-banner bg-muted lg:flex-1" />
            <div aria-hidden className="flex flex-col gap-3 lg:w-[380px] lg:shrink-0">
                <div className="h-48 animate-pulse rounded-card bg-muted" />
                <div className="h-14 animate-pulse rounded-btn bg-muted" />
                <div className="h-12 animate-pulse rounded-card bg-muted" />
            </div>
        </div>
    );
}