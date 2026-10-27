import type { Metadata } from "next";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export const metadata: Metadata = { title: "Writing | BandUp" };

export default function WritingPage() {
    return <PagePlaceholder title="Writing" description="This page is coming soon." />;
}