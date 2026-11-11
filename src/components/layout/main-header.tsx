"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { AuthActions } from "./auth-actions";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS, filterLinks } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const links = filterLinks(NAV_LINKS);

const TOP_OFFSET = 80;
const SCROLL_DELTA = 6;

function useHideOnScroll() {
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const lastY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        lastY.current = window.scrollY;

        const update = () => {
            const y = window.scrollY;
            const delta = y - lastY.current;

            setScrolled(y > 0);

            if (y < TOP_OFFSET) {
                setHidden(false);
                lastY.current = y;
            } else if (Math.abs(delta) > SCROLL_DELTA) {
                setHidden(delta > 0);
                lastY.current = y;
            }

            ticking.current = false;
        };

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return { hidden, scrolled, show: () => setHidden(false) };
}

export function MainHeader() {
    const { hidden, scrolled, show } = useHideOnScroll();

    return (
        <>
            <div aria-hidden className="h-[88px] shrink-0" />
            <header
                onFocusCapture={show}
                className={cn(
                    "fixed inset-x-0 top-0 z-40 border-b bg-background/80 backdrop-blur-md transition-[translate,border-color] duration-300 ease-out will-change-transform motion-reduce:transition-none",
                    hidden ? "-translate-y-full" : "translate-y-0",
                    scrolled ? "border-border" : "border-transparent",
                )}
            >
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
        </>
    );
}