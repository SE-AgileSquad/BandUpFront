"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { canAccessAdmin } from "@/lib/admin-access";
import { cn } from "@/lib/utils";

export function AdminNavLink({ mobile = false }: { mobile?: boolean }) {
    const { user } = useAuth();
    if (!canAccessAdmin(user?.role)) return null;

    return (
        <Button asChild variant="outline" size={mobile ? "icon" : "lg"} className={cn("rounded-xl", mobile ? "size-10" : "mt-3 w-full justify-start px-3")}>
            <Link href={ROUTES.ADMIN} aria-label="Admin Panel" title={mobile ? "Admin Panel" : undefined}>
                <Shield aria-hidden />
                {!mobile && "Admin Panel"}
            </Link>
        </Button>
    );
}
