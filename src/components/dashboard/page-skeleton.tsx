import { DASHBOARD_COPY } from "@/constants/dashboard-nav";

export function PageSkeleton() {
    return (
        <div role="status" aria-busy="true" className="flex flex-col gap-5">
            <span className="sr-only">{DASHBOARD_COPY.loading}</span>
            <div aria-hidden className="h-9 w-56 animate-pulse rounded-nav bg-muted" />
            <div aria-hidden className="h-5 w-80 max-w-full animate-pulse rounded-nav bg-muted" />
            <div aria-hidden className="h-40 animate-pulse rounded-card bg-muted" />
        </div>
    );
}