"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { readMockUserState, writeMockUserState } from "../api/current-user.api";
import {
    CURRENT_USER_QUERY_KEY,
    DEFAULT_MOCK_STATE,
} from "../constants/dashboard.constants";
import type { DashboardUserState } from "../types/dashboard.types";

export function useMockUserState() {
    const queryClient = useQueryClient();
    const [state, setLocalState] = useState<DashboardUserState>(DEFAULT_MOCK_STATE);

    useEffect(() => {
        setLocalState(readMockUserState());
    }, []);

    const setState = useCallback(
        (next: DashboardUserState) => {
            writeMockUserState(next);
            setLocalState(next);
            void queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
        },
        [queryClient],
    );

    return { state, setState };
}