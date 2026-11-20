import { PageTitle } from "@/components/dashboard/page-title";
import { DASHBOARD_PAGE_TITLES, pageMetadata } from "@/constants/dashboard-nav";

export const metadata = pageMetadata(DASHBOARD_PAGE_TITLES.history);

export default function HistoryPage() {
    return <PageTitle title={DASHBOARD_PAGE_TITLES.history} />;
}