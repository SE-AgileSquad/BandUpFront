"use client";

import {
    createContext,
    useContext,
    useId,
    type ComponentProps,
    type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type FieldContextValue = {
    id: string;
    invalid: boolean;
    describedBy?: string;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useField() {
    const context = useContext(FieldContext);
    if (!context) throw new Error("FieldInput must be rendered inside FormField");
    return context;
}

type FormFieldProps = {
    label: string;
    error?: string;
    helper?: string;
    className?: string;
    children: ReactNode;
};

export function FormField({
    label,
    error,
    helper,
    className,
    children,
}: FormFieldProps) {
    const id = useId();
    const messageId = `${id}-message`;
    const hasMessage = Boolean(error || helper);

    return (
        <FieldContext.Provider
            value={{
                id,
                invalid: Boolean(error),
                describedBy: hasMessage ? messageId : undefined,
            }}
        >
            <div className={cn("flex flex-col gap-2", className)}>
                <label
                    htmlFor={id}
                    className="text-[14px] leading-[21px] font-medium text-foreground"
                >
                    {label}
                </label>
                {children}
                {error ? (
                    <p
                        id={messageId}
                        role="alert"
                        className="text-[12px] leading-[18px] text-destructive"
                    >
                        {error}
                    </p>
                ) : helper ? (
                    <p
                        id={messageId}
                        className="text-[12px] leading-[18px] text-muted-foreground"
                    >
                        {helper}
                    </p>
                ) : null}
            </div>
        </FieldContext.Provider>
    );
}

export function FieldInput({ className, ...props }: ComponentProps<"input">) {
    const { id, invalid, describedBy } = useField();

    return (
        <input
            id={id}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
                "h-[52px] w-full rounded-field border border-field-border bg-field px-4 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/25",
                className,
            )}
            {...props}
        />
    );
}