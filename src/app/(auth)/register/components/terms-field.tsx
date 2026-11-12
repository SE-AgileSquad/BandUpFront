"use client";

import { useId, type ComponentProps } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { REGISTER_COPY } from "../constants/register";

type TermsFieldProps = ComponentProps<"input"> & { error?: string };

const linkClass =
    "font-medium text-primary underline-offset-2 hover:underline focus-visible:underline";

export function TermsField({ error, ...props }: TermsFieldProps) {
    const id = useId();
    const errorId = `${id}-error`;
    const { terms } = REGISTER_COPY;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
                <span className="relative mt-px grid size-[18px] shrink-0 place-items-center">
                    <input
                        id={id}
                        type="checkbox"
                        aria-invalid={Boolean(error) || undefined}
                        aria-describedby={error ? errorId : undefined}
                        className="peer size-[18px] cursor-pointer appearance-none rounded-[4px] border-2 border-primary bg-field outline-none checked:bg-primary focus-visible:ring-2 focus-visible:ring-primary/25 aria-[invalid=true]:border-destructive"
                        {...props}
                    />
                    <Check
                        aria-hidden
                        className="pointer-events-none absolute size-3 text-primary-foreground opacity-0 peer-checked:opacity-100"
                    />
                </span>
                <label
                    htmlFor={id}
                    className="text-[12px] leading-[18px] text-muted-foreground"
                >
                    {terms.prefix}
                    <Link
                        href={ROUTES.TERMS}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                    >
                        {terms.termsLabel}
                    </Link>
                    {terms.joiner}
                    <Link
                        href={ROUTES.PRIVACY}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                    >
                        {terms.privacyLabel}
                    </Link>
                    {terms.suffix}
                </label>
            </div>
            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="text-[12px] leading-[18px] text-destructive"
                >
                    {error}
                </p>
            )}
        </div>
    );
}