import { ContentList } from "../_components/content-list";
import { statuses } from "../_lib/contracts";

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const initialStatus = statuses.find((value) => value === status) ?? "";
  return <ContentList key={initialStatus} kind="passages" initialStatus={initialStatus} />;
}
