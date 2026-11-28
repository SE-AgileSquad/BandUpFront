import type { UserRole } from "@/lib/admin-access";

export const statuses = ["Draft", "Published", "Archived"] as const;
export type Status = (typeof statuses)[number];
export const questionTypes = ["TrueFalseNotGiven", "SentenceCompletion"] as const;
export type QuestionType = (typeof questionTypes)[number];
export const questionLabels: Record<QuestionType, string> = {
  TrueFalseNotGiven: "True / False / Not Given",
  SentenceCompletion: "Sentence completion",
};

export type Page<T> = { items: T[]; page: number; pageSize: number; totalCount: number };
export type Readiness = { isReady: boolean; errors: Record<string, string[]> };
export const isResourceId = (id: string) => /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id);
type Content = { id: string; title: string; status: Status };

export type Dashboard = {
  publishedPassages: number;
  draftPassages: number;
  totalLessons: number;
  totalUsers: number;
};

export type AdminUser = {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  creditBalance: number | null;
};

export type PassageInput = { title: string; body: string; sourceNote: string; usageBasis: string };
export type PassageSummary = Content & {
  version: number;
  publishedAt: string | null;
  updatedAt: string | null;
  questionCount: number;
};
export type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  sortOrder: number;
  explanation: string | null;
  evidenceSentence: string | null;
  misleadingSentence: string | null;
  unspecifiedPart: string | null;
  answerKey: {
    correctAnswer: string;
    acceptedVariants: string[];
    verifiedAt: string | null;
    isVerified: boolean;
  } | null;
};
export type Passage = Content & PassageInput & {
  version: number;
  updatedAt: string | null;
  wordCount: number;
  questions: Question[];
  isReadOnly: boolean;
  canCreateRevision: boolean;
  publishReadiness: Readiness;
};

export type LessonInput = { title: string; body: string; questionType: QuestionType; sortOrder: number };
export type ExampleInput = { evidenceSentence: string; paraphrase: string; sortOrder: number };
export type LessonSummary = Content & Omit<LessonInput, "body"> & {
  exampleCount: number;
  hasPractice: boolean;
};
export type Lesson = LessonSummary & LessonInput & {
  examples: (ExampleInput & { id: string })[];
  isReadOnly: boolean;
  canChangeQuestionType: boolean;
  publishReadiness: Readiness;
};
export type Mapping = {
  questionType: QuestionType;
  selectedLesson: Content | null;
  isEnabled: boolean;
  options: { id: string; title: string }[];
};

export type PromptInput = { title: string; taskText: string; essayType: string; minWords: number; maxWords: number };
export type PromptSummary = Content & Omit<PromptInput, "taskText"> & { taskNumber: number; updatedAt: string };
export type Prompt = PromptSummary & PromptInput & { isReadOnly: boolean; publishedAt: string | null };
