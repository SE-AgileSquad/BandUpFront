"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { AuthActions } from "./auth-actions";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS, filterLinks } from "@/constants/navigation";

const links = filterLinks(NAV_LINKS);

export function MainHeader() {
    return (
        <header>
            <div className="container-page flex items-center justify-between py-5">
                <Logo />
                <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-sm text-nav text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <div className="hidden lg:block">
                        <AuthActions />
                    </div>
                    <div className="lg:hidden">
                        <MobileNav />
                    </div>
                </div>
            </div>
        </header>
    );
}