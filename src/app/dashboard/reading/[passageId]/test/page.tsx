import type { Metadata } from "next";
import { TestScreen } from "./components/test-screen";
import { TEST_COPY } from "./constants/test";

export const metadata: Metadata = {
    title: { absolute: TEST_COPY.metadata },
};

export default async function ReadingTestPage({
    params,
}: {
    params: Promise<{ passageId: string }>;
}) {
    const { passageId } = await params;
    return <TestScreen passageId={passageId} />;
}