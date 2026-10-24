"use client";

import { useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                disabled={disabled}
                type={isVisible ? "text" : "password"}
                className={cn("pr-16", className)}
            />
            <button
                type="button"
                disabled={disabled}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                onClick={() => setIsVisible((previous) => !previous)}
                className="absolute inset-y-0 right-3 text-body font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed"
            >
                {isVisible ? "Hide" : "Show"}
            </button>
        </div>
    );
}