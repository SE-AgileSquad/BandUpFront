import type { Metadata } from "next";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export const metadata: Metadata = { title: "Lessons | BandUp" };

export default function LessonsPage() {
    return <PagePlaceholder title="Lessons" description="This page is coming soon." />;
}