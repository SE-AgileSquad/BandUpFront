export type FilterKey = "all" | "new" | "in_progress" | "completed";

export const LIST_COPY = {
    metadata: "Reading tests · BandUp",
    title: "Reading tests",
    subtitle: "Pick a passage. Each test has 10 questions and 20 minutes.",
    filtersLabel: "Filter passages",
    filters: [
        { key: "all", label: "All" },
        { key: "new", label: "New" },
        { key: "in_progress", label: "In progress" },
        { key: "completed", label: "Completed" },
    ] as { key: FilterKey; label: string }[],
    meta: {
        fresh: (questions: number, minutes: number) => `${questions} questions · ${minutes} minutes`,
        inProgress: (clock: string, questions: number) => `${clock} left · ${questions} questions`,
        unsubmitted: "Answers saved on this device",
        completed: (correct: number, total: number) => `${correct} / ${total} correct`,
    },
    badges: {
        new: "New",
        in_progress: "In progress",
        unsubmitted: "Not submitted",
        completed: "Completed",
    },
    actions: {
        new: "Start",
        in_progress: "Continue",
        unsubmitted: "Submit",
        completed: "Review",
    },
    empty: {
        title: "No tests here yet",
        text: "No Reading tests match your current filters. Clear them to see available passages.",
        clear: "Clear filters",
        imageAlt: "Stack of books",
    },
    error: {
        title: "Couldn’t load reading tests",
        text: "Check your connection and try again.",
        retry: "Try again",
    },
    start: {
        title: "Before you start",
        text: "10 questions · 20 minutes. The timer starts when you begin. Unanswered questions are marked wrong. Your answers are saved on this device.",
        hint: "Choose True, False or Not Given for each question. You can review your answers before submitting.",
        imageAlt: "Hourglass",
        confirm: "Start test",
        cancel: "Cancel",
    },
    resume: {
        title: "Your test is saved",
        text: (clock: string, answered: number | null, total: number) =>
            `${clock} remaining${answered !== null ? ` · ${answered} / ${total} answers saved` : ""
            }. Continue the same test from where you left off.`,
        line: (title: string, questionNumber: number | null) =>
            questionNumber ? `${title} · Question ${questionNumber}` : title,
        imageAlt: "BandUp mascot",
        confirm: "Continue",
        cancel: "Cancel",
    },
} as const;