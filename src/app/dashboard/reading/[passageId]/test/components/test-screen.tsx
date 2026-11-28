"use client";

import { SubmitFailedDialog } from "@/app/dashboard/reading/_shared/components/submit-failed-dialog";
import { SubmittingDialog } from "@/app/dashboard/reading/_shared/components/submitting-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PANEL_IDS, TEST_COPY } from "../constants/test";
import { useTestSession } from "../hooks/use-test-session";
import { LeaveDialog } from "./leave-dialog";
import { MobileTabs } from "./mobile-tabs";
import { PassagePanel } from "./passage-panel";
import { QuestionPanel } from "./question-panel";
import { SessionExpiredDialog } from "./session-expired-dialog";
import { SubmitConfirmDialog } from "./submit-confirm-dialog";
import { TestTopBar } from "./test-top-bar";
import { TimerNotice } from "./timer-notice";

function LoadingView() {
    return (
        <div role="status" aria-busy="true" className="min-h-screen bg-background">
            <span className="sr-only">{TEST_COPY.loading}</span>
            <div aria-hidden className="h-[76px] animate-pulse border-b border-border bg-card" />
            <div aria-hidden className="flex flex-col gap-5 px-4 py-7 lg:flex-row lg:px-10">
                <div className="h-96 animate-pulse rounded-card bg-muted lg:flex-1" />
                <div className="h-96 animate-pulse rounded-card bg-muted lg:w-[440px]" />
            </div>
        </div>
    );
}

function ErrorView({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
    const copy = TEST_COPY.loadError;
    return (
        <div className="grid min-h-screen place-items-center bg-background px-4">
            <div className="flex max-w-sm flex-col items-center gap-3 rounded-card border border-border bg-card p-8 text-center">
                <p className="text-[20px] leading-[28px] font-bold">{copy.title}</p>
                <p className="text-[14px] leading-[21px] text-muted-foreground">{copy.text}</p>
                <Button type="button" variant="gradient" size="default" onClick={onRetry}>
                    {copy.retry}
                </Button>
                <Button type="button" variant="brand-outline" size="default" onClick={onBack}>
                    {copy.back}
                </Button>
            </div>
        </div>
    );
}

export function TestScreen({ passageId }: { passageId: string }) {
    const session = useTestSession(passageId);
    const { phase, passage, progress } = session;

    if (phase.kind === "error") {
        return <ErrorView onRetry={session.retryLoad} onBack={session.leave} />;
    }
    if (!passage || !progress) return <LoadingView />;

    const total = session.questions.length;
    const tab = progress.mobileTab;

    return (
        <div className="min-h-screen bg-background">
            <TestTopBar
                answered={session.answeredCount}
                total={total}
                remainingSeconds={session.remainingSeconds}
                locked={session.locked}
                onLeave={session.openLeave}
                onSubmit={session.openConfirm}
            />
            <div aria-hidden className="hidden h-[68px] lg:block" />
            <div className="lg:pr-[440px]">
                <TimerNotice seconds={session.remainingSeconds} />
            </div>
            <MobileTabs value={tab} onChange={session.setTab} />

            <main className="px-4 pt-3 pb-7 lg:pt-0 lg:pb-5 lg:pl-10 lg:pr-[480px]">
                <div className="flex flex-col gap-5 lg:flex-row">
                    <div
                        id={PANEL_IDS.passage}
                        role="tabpanel"
                        className={cn("min-w-0 lg:block lg:flex-1", tab === "passage" ? "block" : "hidden")}
                    >
                        <PassagePanel passage={passage} />
                    </div>
                    <div
                        id={PANEL_IDS.questions}
                        role="tabpanel"
                        className={cn(
                            "lg:fixed lg:top-[68px] lg:right-0 lg:bottom-0 lg:z-20 lg:block lg:w-[440px] lg:overflow-hidden lg:border-l lg:border-border lg:bg-background lg:p-4",
                            tab === "questions" ? "block" : "hidden",
                        )}
                    >
                        <QuestionPanel
                            questions={session.questions}
                            currentIndex={progress.currentIndex}
                            answers={session.answers}
                            answeredCount={session.answeredCount}
                            locked={session.locked}
                            onSelect={session.goTo}
                            onAnswer={session.setAnswer}
                            onClear={session.clearAnswer}
                            onPrev={session.prev}
                            onNext={session.next}
                        />
                    </div>
                </div>
            </main>

            <SubmitConfirmDialog
                open={phase.kind === "confirming"}
                answered={session.answeredCount}
                total={total}
                onConfirm={session.confirmSubmit}
                onClose={session.closeDialog}
            />
            <LeaveDialog
                open={phase.kind === "leaving"}
                answered={session.answeredCount}
                onLeave={session.leave}
                onStay={session.closeDialog}
            />
            <SubmittingDialog
                open={phase.kind === "submitting"}
                reason={phase.kind === "submitting" ? phase.reason : "manual"}
                unanswered={total - session.answeredCount}
            />
            <SubmitFailedDialog
                open={phase.kind === "failed"}
                answered={session.answeredCount}
                canReturnToTest={session.canReturnToTest}
                onRetry={session.retrySubmit}
                onSecondary={session.backFromFailed}
            />
            <SessionExpiredDialog
                open={phase.kind === "sessionExpired"}
                title={passage.title}
                questionNumber={progress.currentIndex + 1}
                onSignIn={session.signIn}
            />
        </div>
    );
}
