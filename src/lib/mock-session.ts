import type { AuthUser } from "@/types/auth";

let mockUser: AuthUser | null = null;

export const mockSession = {
    get: () => mockUser,
    set: (user: AuthUser | null) => {
        mockUser = user;
    },
};