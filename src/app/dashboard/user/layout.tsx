import type { ReactNode } from "react";
import { UserDashboardLayout } from "@/features/dashboard/components/user-dashboard-layout";

export default function UserLayout({ children }: { children: ReactNode }) {
    return <UserDashboardLayout>{children}</UserDashboardLayout>;
}