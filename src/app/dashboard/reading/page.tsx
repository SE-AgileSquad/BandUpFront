import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle } from "@/components/dashboard/page-title";
import { ListSkeleton } from "./components/list-skeleton";
import { ReadingListView } from "./components/reading-list-view";
import { LIST_COPY } from "./constants/list";

export const metadata: Metadata = {
    title: { absolute: LIST_COPY.metadata },
};

export default function ReadingPage() {
    return (
        <>
            <PageTitle title={LIST_COPY.title} />
            <Suspense fallback={<ListSkeleton />}>
                <ReadingListView />
            </Suspense>
        </>
    );
}