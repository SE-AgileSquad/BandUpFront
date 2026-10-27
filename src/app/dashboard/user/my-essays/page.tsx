import type { Metadata } from "next";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export const metadata: Metadata = { title: "My Essays | BandUp" };

export default function MyEssaysPage() {
    return <PagePlaceholder title="My Essays" description="This page is coming soon." />;
}