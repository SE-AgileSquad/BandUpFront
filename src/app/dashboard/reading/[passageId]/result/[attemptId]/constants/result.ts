export const RESULT_COPY = {
    metadata: "Test completed · BandUp",
    title: "Test completed",
    defaultHeadline: "Good effort!",
    trophyAlt: "BandUp mascot holding a trophy",
    band: (band: number) => `Estimated band ${band.toFixed(1)} (approximate)`,
    disclaimer: "Estimated — not an official IELTS score",
    breakdownTitle: "Your score breakdown",
    review: "Review answers →",
    lesson: (title: string) => `Suggested lesson: ${title}`,
    paraphrase: (count: number) => `Practice paraphrases (${count} new)`,
    another: "Take another test",
    loading: "Loading your result",
    error: {
        title: "Couldn’t load your result",
        text: "Check your connection and try again.",
        retry: "Try again",
    },
} as const;