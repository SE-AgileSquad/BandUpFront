import Image from "next/image";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";
import { AUTH_PHOTO_SRC } from "../constants/auth.constants";

interface AuthShellProps {
    children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
    return (
        <div className="min-h-dvh bg-background md:bg-muted lg:grid lg:grid-cols-[560px_minmax(0,1fr)] lg:bg-background">
            <aside className="relative hidden overflow-hidden bg-primary lg:block">
                <Image
                    src={AUTH_PHOTO_SRC}
                    alt=""
                    fill
                    priority
                    sizes="560px"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-primary/85 via-primary/[0.22] to-primary/90" />
                <p className="absolute inset-x-0 bottom-0 px-14 pb-12 text-small text-primary-foreground/60">
                    BandUp is not affiliated with IELTS owners.
                </p>
            </aside>

            <main className="grid min-h-dvh items-start justify-items-center px-6 pb-10 pt-6 md:items-center md:px-0 md:py-12 lg:py-0">
                <div className="mx-auto flex w-full max-w-[400px] flex-col gap-7 md:max-w-[480px] md:rounded-xl md:border md:border-border md:bg-background md:p-8 lg:max-w-[400px] lg:rounded-none lg:border-0 lg:p-0">
                    <div className="flex justify-center">
                        <Logo />
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}