import { RESULT_COPY } from "../constants/result";

export function ResultSkeleton() {
    return (
        <div role="status" aria-busy="true" className="grid min-w-0 grid-cols-1 items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)] lg:gap-8">
            <span className="sr-only">{RESULT_COPY.loading}</span>
            <div aria-hidden className="mx-auto aspect-square w-full max-w-[500px] animate-pulse rounded-full bg-muted" />
            <div aria-hidden className="flex flex-col gap-5 rounded-card border border-border bg-card p-5 sm:p-7">
                <div className="h-48 animate-pulse rounded-frame bg-muted" />
                <div className="h-[68px] animate-pulse rounded-frame bg-muted" />
                <div className="h-12 animate-pulse rounded-btn bg-muted" />
                <div className="h-12 animate-pulse rounded-btn bg-muted" />
            </div>
        </div>
    );
}
