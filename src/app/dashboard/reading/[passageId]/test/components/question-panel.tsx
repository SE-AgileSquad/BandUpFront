"use client";

import type { Answers, Question } from "@/app/dashboard/reading/_shared/types";
import { Button } from "@/components/ui/button";
import { TEST_COPY } from "../constants/test";
import { CompletionInput } from "./completion-input";
import { QuestionPalette } from "./question-palette";
import { TfngOptions } from "./tfng-options";

type QuestionPanelProps = {
    questions: Question[];
    currentIndex: number;
    answers: Answers;
    answeredCount: number;
    locked: boolean;
    onSelect: (index: number) => void;
    onAnswer: (questionId: string, value: string) => void;
    onClear: (questionId: string) => void;
    onPrev: () => void;
    onNext: () => void;
};

export function QuestionPanel({
    questions,
    currentIndex,
    answers,
    answeredCount,
    locked,
    onSelect,
    onAnswer,
    onClear,
    onPrev,
    onNext,
}: QuestionPanelProps) {
    const question = questions[currentIndex];
    if (!question) return null;

    const value = answers[question.id] ?? "";
    const promptId = `question-prompt-${question.id}`;
    const lastIndex = questions.length - 1;

    return (
        <section
            aria-label={TEST_COPY.palette.label}
            className="flex flex-col gap-[14px] rounded-card border border-border bg-card p-6"
        >
            <QuestionPalette
                questions={questions}
                answers={answers}
                currentIndex={currentIndex}
                disabled={locked}
                onSelect={onSelect}
            />

            <p className="text-[13px] leading-[1.4] font-medium text-muted-foreground">
                {question.groupLabel}
            </p>
            <h2 id={promptId} className="text-[17px] leading-[24px] font-semibold">
                {question.number}. {question.prompt}
            </h2>

            {question.type === "tfng" ? (
                <TfngOptions
                    labelledBy={promptId}
                    value={value}
                    disabled={locked}
                    onChange={(next) => onAnswer(question.id, next)}
                />
            ) : (
                <CompletionInput
                    value={value}
                    disabled={locked}
                    onChange={(next) => onAnswer(question.id, next)}
                />
            )}

            <div className="flex items-center justify-between gap-2">
                <button
                    type="button"
                    disabled={locked || !value.trim()}
                    onClick={() => onClear(question.id)}
                    className="rounded-sm text-[14px] leading-[21px] font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {TEST_COPY.actions.clear}
                </button>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="brand-outline"
                        size="default"
                        disabled={locked || currentIndex === 0}
                        onClick={onPrev}
                    >
                        {TEST_COPY.actions.previous}
                    </Button>
                    <Button
                        type="button"
                        variant="gradient"
                        size="default"
                        disabled={locked || currentIndex === lastIndex}
                        onClick={onNext}
                    >
                        {TEST_COPY.actions.next}
                    </Button>
                </div>
            </div>

            <div aria-live="polite" className="text-[12px] leading-[1.4] text-muted-foreground">
                {locked ? (
                    <p>{TEST_COPY.locked}</p>
                ) : <p>{TEST_COPY.saved(answeredCount)}</p>}
            </div>
        </section>
    );
}
