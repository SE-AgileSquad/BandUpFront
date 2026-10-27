import type { Metadata } from "next";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export const metadata: Metadata = { title: "My Mistakes | BandUp" };

export default function MistakesPage() {
    return <PagePlaceholder title="My Mistakes" description="This page is coming soon." />;
}