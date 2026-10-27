type SkeletonVariant = "card" | "badge" | "greeting";

interface UserCardSkeletonProps {
    variant?: SkeletonVariant;
}

export function UserCardSkeleton({ variant = "card" }: UserCardSkeletonProps) {
    if (variant === "badge") {
        return (
            <div aria-hidden="true" className="h-9 w-28 animate-pulse rounded-full bg-muted" />
        );
    }

    if (variant === "greeting") {
        return (
            <div aria-hidden="true" className="flex animate-pulse flex-col gap-3">
                <div className="h-9 w-64 max-w-full rounded-lg bg-border" />
                <div className="h-5 w-80 max-w-full rounded-lg bg-border" />
            </div>
        );
    }

    return (
        <div
            aria-hidden="true"
            className="flex animate-pulse items-center gap-3 rounded-xl bg-muted p-3"
        >
            <div className="size-9 shrink-0 rounded-full bg-border" />
            <div className="flex flex-1 flex-col gap-2">
                <div className="h-3.5 w-24 rounded bg-border" />
                <div className="h-3 w-32 rounded bg-border" />
            </div>
        </div>
    );
}