import { DASHBOARD_ROUTES } from "@/constants/routes";
import type { Passage, ResultPayload, TfngValue } from "../types";

export const PASSAGE_CATALOG = [
    { id: "urban-beekeeping", title: "Urban Beekeeping" },
    { id: "cooling-cities", title: "Cooling Cities" },
    { id: "history-of-tea", title: "The History of Tea" },
    { id: "history-of-timekeeping", title: "The history of timekeeping" },
    { id: "passage-5", title: "Passage 5" },
    { id: "passage-6", title: "Passage 6" },
];

const PARAGRAPHS = [
    {
        label: "A",
        text: "Over the past two decades, keeping bees has moved from the countryside to the city. Hives now sit on the roofs of offices, hotels and apartment blocks in cities across Europe, North America and Asia. One reason is the variety of food on offer: parks, balconies and street trees flower at different times of the year, so a colony in a dense neighbourhood often finds nectar within a few hundred metres of its hive. Some beekeepers report that their city colonies produce more honey than those they once kept in farmland, where a single crop may flower for only a few weeks.",
    },
    {
        label: "B",
        text: "Cities are not simply a safe haven, however. Traffic fumes and building work add dust and chemicals to the air, and researchers continue to study whether these end up in the honey. Most municipal authorities allow beekeeping but ask hobbyists to register their hives, and a handful of cities limit the number of hives per street. Ecologists have also raised a concern: when thousands of managed honeybees compete for the same flowers, wild pollinators such as solitary bees may have less to eat. As a result, several conservation groups now encourage city dwellers to plant flowers rather than to add hives.",
    },
    {
        label: "C",
        text: "Urban beekeeping also has a social side. Many schools use rooftop hives to teach children about food and the environment, and community projects sell honey to fund neighbourhood gardens. Yet the hobby demands more skill than newcomers expect. A colony can swarm in early summer, which alarms neighbours, and a beginner who has not been trained may lose the hive in its first winter. Experienced keepers therefore advise new members to join a local association and to spend a season helping at an established apiary before buying their own bees.",
    },
];

export const STATEMENTS: { prompt: string; answer: TfngValue }[] = [
    { prompt: "Beekeeping in cities is limited to Europe.", answer: "FALSE" },
    { prompt: "City colonies can find nectar close to their hives.", answer: "TRUE" },
    { prompt: "Farmland always produces more honey than city hives.", answer: "FALSE" },
    { prompt: "Scientists have proved that city honey is unsafe to eat.", answer: "FALSE" },
    { prompt: "All cities ban hives within a set distance of schools.", answer: "NOT_GIVEN" },
    { prompt: "Some cities restrict how many hives may be kept on one street.", answer: "TRUE" },
    { prompt: "Too many honeybee hives may harm wild pollinators.", answer: "TRUE" },
    { prompt: "Conservation groups recommend adding more hives to city rooftops.", answer: "FALSE" },
    { prompt: "Hives in schools have reduced the number of swarms.", answer: "NOT_GIVEN" },
    { prompt: "Beginners are advised to help at an established apiary before buying bees.", answer: "TRUE" },
];

export const ANSWER_KEY: Record<string, string> = Object.fromEntries(
    STATEMENTS.map((statement, index) => [`q${index + 1}`, statement.answer]),
);

const GROUP_LABEL = "Questions 1–10 · True, False or Not Given";

export function buildPassage(passageId: string): Passage | null {
    const index = PASSAGE_CATALOG.findIndex((passage) => passage.id === passageId);
    if (index === -1) return null;
    return {
        id: passageId,
        title: PASSAGE_CATALOG[index].title,
        eyebrow: `ACADEMIC READING · PASSAGE ${index + 1}`,
        paragraphs: PARAGRAPHS,
        questions: STATEMENTS.map((statement, i) => ({
            id: `q${i + 1}`,
            number: i + 1,
            type: "tfng",
            groupLabel: GROUP_LABEL,
            prompt: statement.prompt,
        })),
    };
}

const BAND_BY_SCORE = [4, 4, 4, 4.5, 5, 5.5, 6, 6.5, 7.5, 8, 8.5];

function headlineFor(correct: number, total: number) {
    const ratio = correct / total;
    if (ratio >= 0.9) return "Excellent work!";
    if (ratio >= 0.7) return "Good effort!";
    if (ratio >= 0.4) return "Keep going!";
    return "Every mistake is a lesson.";
}

export function scoreAnswers(
    passageId: string,
    attemptId: string,
    title: string,
    answers: Record<string, string>,
): ResultPayload {
    const groups: Record<TfngValue, { correct: number; total: number }> = {
        TRUE: { correct: 0, total: 0 },
        FALSE: { correct: 0, total: 0 },
        NOT_GIVEN: { correct: 0, total: 0 },
    };
    let correct = 0;

    STATEMENTS.forEach((statement, index) => {
        const given = (answers[`q${index + 1}`] ?? "").trim().toUpperCase();
        groups[statement.answer].total += 1;
        if (given === statement.answer) {
            correct += 1;
            groups[statement.answer].correct += 1;
        }
    });

    const total = STATEMENTS.length;
    const wrong = total - correct;

    return {
        attemptId,
        passageId,
        title,
        correct,
        total,
        headline: headlineFor(correct, total),
        band: BAND_BY_SCORE[Math.min(correct, 10)],
        breakdown: [
            { label: "True statements", ...groups.TRUE },
            { label: "False statements", ...groups.FALSE },
            { label: "Not Given statements", ...groups.NOT_GIVEN },
        ],
        suggestedLesson:
            wrong > 0
                ? { title: "Spotting Not Given answers", href: DASHBOARD_ROUTES.LESSONS }
                : undefined,
        newParaphraseCount: wrong > 0 ? wrong : undefined,
    };
}