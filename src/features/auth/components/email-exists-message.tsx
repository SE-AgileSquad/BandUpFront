"use client";

import Link from "next/link";
import { useFormField } from "@/components/ui/form";
import { LOGIN_PATH } from "../constants/auth.constants";

export function EmailExistsMessage() {
    const { formMessageId } = useFormField();

    return (
        <p id={formMessageId} className="text-small text-destructive">
            An account with this email already exists.{" "}
            <Link href={LOGIN_PATH} className="font-medium underline">
                Sign in instead?
            </Link>
        </p>
    );
}