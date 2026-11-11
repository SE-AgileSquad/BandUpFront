"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { AuthActions } from "./auth-actions";
import { NAV_LINKS, filterLinks } from "@/constants/navigation";

const links = filterLinks(NAV_LINKS);

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="brand-outline" size="icon-lg" aria-label="Open menu">
                    <Menu className="size-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="gap-8 bg-background p-6">
                <SheetHeader className="p-0">
                    <SheetTitle className="text-card-title">Menu</SheetTitle>
                    <SheetDescription className="sr-only">Site navigation</SheetDescription>
                </SheetHeader>
                <nav aria-label="Mobile" className="flex flex-col">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={close}
                            className="border-b border-border py-3 text-nav text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <AuthActions stacked onNavigate={close} />
            </SheetContent>
        </Sheet>
    );
}