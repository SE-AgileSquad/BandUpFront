"use client";

import { useAuth } from "@/hooks/use-auth";
import { filterLinks, type FooterColumnData } from "@/constants/navigation";
import { FooterColumn } from "./footer-column";

export function FooterAccount({ column }: { column: FooterColumnData }) {
    const { isAuthenticated, isLoading } = useAuth();

    return (
        <FooterColumn
            title={column.title}
            links={filterLinks(column.links, isAuthenticated)}
            pending={isLoading}
        />
    );
}