import type { Metadata } from "next";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export const metadata: Metadata = { title: "Test History | BandUp" };

export default function TestHistoryPage() {
    return <PagePlaceholder title="Test History" description="This page is coming soon." />;
}