import type { Metadata } from "next";
import { DashboardHomePlaceholder } from "@/features/dashboard/components/dashboard-home-placeholder";

export const metadata: Metadata = { title: "Dashboard | BandUp" };

export default function DashboardPage() {
    return <DashboardHomePlaceholder />;
}