const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const NOTICE_WARNING_SECONDS = 300;
export const NOTICE_CRITICAL_SECONDS = 60;

export const PANEL_IDS = {
    passage: "reading-panel-passage",
    questions: "reading-panel-questions",
} as const;

export const TEST_COPY = {
    metadata: "Reading test · BandUp",
    answered: (n: number, total: number) => `${n} of ${total} answered`,
    leave: "Leave test",
    submit: "Submit",
    submitting: "Submitting…",
    tabs: { label: "Test sections", passage: "Passage", questions: "Questions" },
    timer: { label: "Time remaining" },
    notice: {
        warning: {
            title: "5 minutes left",
            text: "Keep going. Check unanswered questions before the timer ends.",
        },
        critical: {
            title: "1 minute left",
            text: "Your test will submit automatically at 00:00. Review any unanswered questions now.",
        },
    },
    passage: {
        footer: (total: number) => `Read the passage and answer questions 1–${total}.`,
    },
    palette: {
        label: "Questions",
        item: (n: number, answered: boolean) =>
            `Question ${n}, ${answered ? "answered" : "unanswered"}`,
    },
    completion: { label: "Your answer" },
    actions: { clear: "Clear answer", previous: "Previous", next: "Next" },
    saved: (n: number) => `${n} ${plural(n, "answer", "answers")} saved on this device`,
    locked: "Answers locked while submitting",
    loading: "Loading your test",
    loadError: {
        title: "Couldn’t load your test",
        text: "Check your connection and try again.",
        retry: "Try again",
        back: "Back to reading tests",
    },
    confirm: {
        title: "Submit your test?",
        text: (answered: number, unanswered: number, total: number) =>
            unanswered === 0
                ? `All ${total} questions answered. You can’t change your answers after submission.`
                : `${answered} answered · ${unanswered} unanswered. Unanswered questions will be marked wrong. You can’t change your answers after submission.`,
        chip: (answered: number, unanswered: number) =>
            `${answered} answered · ${unanswered} unanswered`,
        submit: "Submit test",
        back: "Back to test",
    },
    leaveDialog: {
        title: "Leave this test?",
        text: (answered: number) =>
            `${answered > 0
                ? `Your ${answered} ${plural(answered, "answer is", "answers are")} saved locally on this device.`
                : "Your progress is saved locally on this device."
            } You can return to this test later; the timer will not reset.`,
        leave: "Leave test",
        stay: "Keep practising",
    },
    sessionExpired: {
        title: "Sign in again to continue",
        text: (title: string, questionNumber: number) =>
            `Your session expired. Your answers are kept on this device. Sign in again and return to this same test — ${title}, question ${questionNumber}.`,
        chip: "Answers protected",
        destination: "Return destination: this test, not the dashboard.",
        action: "Sign in again",
    },
} as const;