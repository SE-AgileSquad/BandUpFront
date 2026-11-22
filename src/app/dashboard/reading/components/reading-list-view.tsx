"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import { useAuth } from "@/hooks/use-auth";
import { LIST_COPY, type FilterKey } from "../constants/list";
import { useListItems, type ListItem } from "../hooks/use-list-items";
import { usePassages } from "../hooks/use-passages";
import { useRecovery } from "../hooks/use-recovery";
import { ListEmpty } from "./list-empty";
import { ListFilters } from "./list-filters";
import { ListSkeleton } from "./list-skeleton";
import { PassageCard } from "./passage-card";
import { RecoveryDialog } from "./recovery-dialog";
import { ResumeDialog } from "./resume-dialog";
import { StartDialog } from "./start-dialog";

function matches(filter: FilterKey, item: ListItem) {
    if (filter === "all") return true;
    if (filter === "in_progress") {
        return item.state.kind === "in_progress" || item.state.kind === "unsubmitted";
    }
    return item.state.kind === filter;
}

export function ReadingListView() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const userId = user?.id ?? null;

    const { passages, dataUpdatedAt, isPending, isError, refetch } = usePassages();
    const items = useListItems({ passages, dataUpdatedAt, userId });
    const recovery = useRecovery(userId);

    const [filter, setFilter] = useState<FilterKey>("all");
    const [startItem, setStartItem] = useState<ListItem | null>(null);
    const [resumeItem, setResumeItem] = useState<ListItem | null>(null);

    const recoverId = searchParams.get("recover");
    const recoverHandled = useRef(false);
    const { run } = recovery;

    useEffect(() => {
        if (!recoverId || !userId || recoverHandled.current) return;
        recoverHandled.current = true;
        router.replace(pathname);
        void run(recoverId);
    }, [recoverId, userId, pathname, router, run]);

    function handleSelect(item: ListItem) {
        switch (item.state.kind) {
            case "new":
                setStartItem(item);
                break;
            case "in_progress":
                setResumeItem(item);
                break;
            case "unsubmitted":
                void recovery.run(item.passage.id);
                break;
            case "completed":
                if (item.state.href) router.push(item.state.href);
                break;
        }
    }

    const visible = items.filter((item) => matches(filter, item));

    return (
        <>
            <p className="-mt-2 text-[15px] leading-[22px] text-muted-foreground">
                {LIST_COPY.subtitle}
            </p>
            <ListFilters value={filter} onChange={setFilter} />

            {isPending ? (
                <ListSkeleton />
            ) : isError ? (
                <ListEmpty variant="error" onRetry={() => void refetch()} />
            ) : visible.length === 0 ? (
                <ListEmpty
                    variant="empty"
                    showClear={filter !== "all"}
                    onClear={() => setFilter("all")}
                />
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visible.map((item) => (
                        <PassageCard key={item.passage.id} item={item} onSelect={handleSelect} />
                    ))}
                </div>
            )}

            <StartDialog
                open={startItem !== null}
                onClose={() => setStartItem(null)}
                onConfirm={() => {
                    if (startItem) router.push(READING_PATHS.test(startItem.passage.id));
                }}
            />
            <ResumeDialog
                item={resumeItem}
                onClose={() => setResumeItem(null)}
                onConfirm={() => {
                    if (resumeItem) router.push(READING_PATHS.test(resumeItem.passage.id));
                }}
            />
            <RecoveryDialog
                state={recovery.state}
                onRetry={recovery.retry}
                onDismiss={recovery.dismiss}
            />
        </>
    );
}