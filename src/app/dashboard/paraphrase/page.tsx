import { PageTitle } from "@/components/dashboard/page-title";
import { DASHBOARD_PAGE_TITLES, pageMetadata } from "@/constants/dashboard-nav";

export const metadata = pageMetadata(DASHBOARD_PAGE_TITLES.paraphrase);

export default function ParaphrasePage() {
    return <PageTitle title={DASHBOARD_PAGE_TITLES.paraphrase} />;
}