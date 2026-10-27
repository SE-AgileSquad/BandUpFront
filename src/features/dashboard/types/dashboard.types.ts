export type UserRole = "user";
export type DashboardUserState = "new" | "returning";

export interface UserProfile {
    id: string;
    displayName: string;
    email: string;
    role: UserRole;
    credits: number;
}

export interface AccuracyStat {
    correct: number;
    total: number;
}

export interface LastTest {
    title: string;
    date: string;
    score: number;
    outOf: number;
    estimatedBand: number;
}

export interface DashboardSummary {
    dueToday: { phrases: number; cards: number };
    accuracy: {
        trueFalseNotGiven: AccuracyStat;
        sentenceCompletion: AccuracyStat;
    };
    lessons: { completed: number; total: number };
    lastTest: LastTest | null;
}

export interface CurrentUserData {
    state: DashboardUserState;
    user: UserProfile;
    summary: DashboardSummary;
}