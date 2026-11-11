import { ROUTES } from "@/constants/routes";
import type {
    CtaBannerContent,
    FeaturesContent,
    HeroContent,
    MethodContent,
} from "../types";

export const PAGE_METADATA = {
    title: "BandUp — IELTS practice that turns every mistake into a lesson",
    description:
        "BandUp shows the evidence sentence behind every wrong IELTS answer, then brings each mistake back as a lesson, a drill and a flashcard until it sticks.",
} as const;

export const HERO: HeroContent = {
    pill: "IELTS Academic · Reading & Writing",
    titleLead: "Turn every mistake into a ",
    titleAccent: "lesson.",
    lead: "BandUp does more than score your IELTS practice. It shows the sentence that held the answer, then brings every mistake back as a lesson, a drill and a flashcard until it sticks.",
    cta: {
        guest: { label: "Start practicing free →", href: ROUTES.REGISTER },
        authed: { label: "Go to dashboard →", href: ROUTES.DASHBOARD },
    },
    secondary: { label: "See how it works", href: "#method" },
    reassurance: ["Free to start", "3 free Writing checks", "Reading + Writing focus"],
    image: { src: '/images/landing/img_mascot_main.png', alt: "BandUp mascot" },
};

export const METHOD: MethodContent = {
    eyebrow: "THE METHOD",
    title: "Every mistake comes back as something useful.",
    steps: [
        {
            number: "01",
            title: "Take the exam",
            description: "Finish a timed Reading passage, just like test day.",
        },
        {
            number: "02",
            title: "Diagnose",
            description:
                "See the question type, the evidence sentence and the paraphrase pair.",
        },
        {
            number: "03",
            title: "Convert",
            description: "The mistake becomes a lesson, a drill and a vocabulary card.",
            highlighted: true,
        },
        {
            number: "04",
            title: "Revisit",
            description: "Cards and drills return after 1, 2, 4, 8 and 16 days.",
        },
        {
            number: "05",
            title: "Measure",
            description: "Watch accuracy per question type climb, week after week.",
        },
    ],
};

export const FEATURES: FeaturesContent = {
    srTitle: "Features",
    rows: [
        {
            eyebrow: "REVIEW",
            title: "See exactly why you were wrong",
            description:
                "Not just a score. For every question you see the evidence sentence in the passage and the phrases that mean the same thing in different words.",
            bullets: [
                "Evidence sentence highlighted in the passage",
                "Paraphrase pairs shown side by side",
                "A lesson suggested for each mistake",
            ],
            image: {
                src: '/images/landing/img_mascot_review.png',
                alt: "BandUp review card with highlighted evidence and paraphrase chips",
            },
        },
        {
            eyebrow: "PRACTICE",
            title: "Turn every mistake into practice",
            description:
                "Each mistake becomes a short drill, a lesson and a Word Card that come back on a schedule, so you actually remember them.",
            bullets: [
                "A 2–3 minute Paraphrase Trainer",
                "Word Cards with the sentence you found them in",
                "Spaced review at 1, 2, 4, 8 and 16 days",
            ],
            image: {
                src: '/images/landing/img_mascot_practice.png',
                alt: "Mistake to trainer to word cards to spaced review flow",
            },
            reversed: true,
        },
        {
            id: "writing-feedback",
            eyebrow: "WRITING",
            title: "Get estimated Writing feedback",
            description:
                "Submit a Task 2 essay and get feedback on the four IELTS criteria, with strengths and specific suggestions to improve.",
            bullets: [
                "Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy",
                "Strengths, weaknesses and next steps",
                "Clearly labeled as an estimate, not an official IELTS score",
            ],
            image: {
                src: '/images/landing/img_mascot_feedback.png',
                alt: "Writing feedback card with radar chart",
            },
        },
    ],
};

export const CTA_BANNER: CtaBannerContent = {
    title: "Ready to find out why?",
    description:
        "Create a free account, take your first Reading passage and see your first evidence sentence in minutes.",
    cta: {
        guest: { label: "Create free account →", href: ROUTES.REGISTER },
        authed: { label: "Go to dashboard →", href: ROUTES.DASHBOARD },
    },
    image: { src: '/images/landing/img_mascot_ready.png', alt: "BandUp mascot" },
};