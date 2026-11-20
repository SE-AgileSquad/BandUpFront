import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireAuth } from "@/components/dashboard/require-auth";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardShell>
            <RequireAuth>{children}</RequireAuth>
        </DashboardShell>
    );
}