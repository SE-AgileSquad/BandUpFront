import type { Metadata } from "next";
import { PageTitle } from "@/components/dashboard/page-title";
import { ResultView } from "./components/result-view";
import { RESULT_COPY } from "./constants/result";

export const metadata: Metadata = {
    title: { absolute: RESULT_COPY.metadata },
};

export default async function ReadingResultPage({
    params,
}: {
    params: Promise<{ passageId: string; attemptId: string }>;
}) {
    const { passageId, attemptId } = await params;

    return (
        <>
            <PageTitle title={RESULT_COPY.title} />
            <ResultView passageId={passageId} attemptId={attemptId} />
        </>
    );
}