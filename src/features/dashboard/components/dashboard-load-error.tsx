import { Button } from "@/components/ui/button";

interface DashboardLoadErrorProps {
    onRetry: () => void;
}

export function DashboardLoadError({ onRetry }: DashboardLoadErrorProps) {
    return (
        <div
            role="alert"
            className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-background p-8"
        >
            <p className="text-body text-foreground">Couldn&apos;t load your account.</p>
            <Button variant="outline" onClick={onRetry} className="h-10 text-body">
                Try again
            </Button>
        </div>
    );
}