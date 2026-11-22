export function ListSkeleton() {
    return (
        <div
            role="status"
            aria-busy="true"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
            <span className="sr-only">Loading</span>
            {Array.from({ length: 6 }, (_, index) => (
                <div
                    key={index}
                    aria-hidden
                    className="flex flex-col gap-[10px] rounded-card border border-border bg-card p-[18px]"
                >
                    <div className="h-[110px] animate-pulse rounded-frame bg-muted" />
                    <div className="h-5 w-2/3 animate-pulse rounded-pill bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded-pill bg-muted" />
                    <div className="mt-1 h-6 w-full animate-pulse rounded-pill bg-muted" />
                </div>
            ))}
        </div>
    );
}