import type { Metadata } from "next";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export const metadata: Metadata = { title: "Assistant | BandUp" };

export default function AssistantPage() {
    return <PagePlaceholder title="Assistant" description="This page is coming soon." />;
}