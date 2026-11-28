"use client";

import type { Answers, Question } from "@/app/dashboard/reading/_shared/types";
import { cn } from "@/lib/utils";
import { TEST_COPY } from "../constants/test";

type QuestionPaletteProps = {
    questions: Question[];
    answers: Answers;
    currentIndex: number;
    disabled: boolean;
    onSelect: (index: number) => void;
};

export function QuestionPalette({
    questions,
    answers,
    currentIndex,
    disabled,
    onSelect,
}: QuestionPaletteProps) {
    return (
        <div role="group" aria-label={TEST_COPY.palette.label} className="flex flex-wrap gap-2">
            {questions.map((question, index) => {
                const answered = Boolean(answers[question.id]?.trim());
                const current = index === currentIndex;
                return (
                    <button
                        key={question.id}
                        type="button"
                        disabled={disabled}
                        aria-label={TEST_COPY.palette.item(question.number, answered)}
                        aria-current={current ? "step" : undefined}
                        onClick={() => onSelect(index)}
                        className={cn(
                            "size-7 rounded-chip border text-[13px] leading-none font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed lg:size-9",
                            answered
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-foreground",
                            current && !answered && "border-primary bg-primary-soft",
                            current && answered && "ring-2 ring-primary/30",
                        )}
                    >
                        {question.number}
                    </button>
                );
            })}
        </div>
    );
}