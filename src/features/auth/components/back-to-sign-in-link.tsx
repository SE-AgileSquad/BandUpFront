import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LOGIN_PATH } from "../constants/auth.constants";

export function BackToSignInLink() {
    return (
        <Link
            href={LOGIN_PATH}
            className="mt-auto flex items-center justify-center gap-1.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to sign in
        </Link>
    );
}