import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FormAlertVariant = "error" | "success" | "info";

interface FormAlertProps {
    variant: FormAlertVariant;
    children: ReactNode;
    id?: string;
    className?: string;
}

const VARIANTS = {
    error: {
        container: "border-destructive/30 bg-destructive-bg text-destructive",
        Icon: AlertCircle,
    },
    success: {
        container: "border-primary/20 bg-accent text-primary",
        Icon: CheckCircle2,
    },
    info: {
        container: "border-border bg-muted text-foreground",
        Icon: Info,
    },
} satisfies Record<
    FormAlertVariant,
    { container: string; Icon: typeof Info }
>;

export function FormAlert({ variant, children, id, className }: FormAlertProps) {
    const { container, Icon } = VARIANTS[variant];

    return (
        <div
            id={id}
            role={variant === "error" ? "alert" : "status"}
            className={cn(
                "flex items-start gap-2 rounded-lg border p-3 text-small",
                container,
                className,
            )}
        >
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>{children}</div>
        </div>
    );
}