import type { Metadata } from "next";
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
            <header className="text-center">
                <h1 className="text-[clamp(2rem,4vw,3rem)] leading-tight font-bold tracking-tight text-foreground">
                    {RESULT_COPY.title}
                </h1>
                <p className="mt-2 text-[16px] leading-6 text-muted-foreground">
                    {RESULT_COPY.subtitle}
                </p>
            </header>
            <ResultView passageId={passageId} attemptId={attemptId} />
        </>
    );
}
