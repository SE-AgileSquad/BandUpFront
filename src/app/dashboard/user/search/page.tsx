import type { Metadata } from "next";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export const metadata: Metadata = { title: "Search | BandUp" };

export default function SearchPage() {
    return <PagePlaceholder title="Search" description="This page is coming soon." />;
}