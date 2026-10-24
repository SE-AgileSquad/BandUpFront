"use client";

import type { ComponentProps } from "react";
import { useFormField } from "@/components/ui/form";

export function FieldMessage({ children, ...props }: ComponentProps<"p">) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error.message ?? "") : children;

    if (!body) {
        return null;
    }

    return (
        <p
            {...props}
            id={formMessageId}
            className="text-small font-normal text-destructive"
        >
            {body}
        </p>
    );
}