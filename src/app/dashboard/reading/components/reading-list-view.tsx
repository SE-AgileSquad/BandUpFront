"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { READING_PATHS } from "@/app/dashboard/reading/_shared/constants/reading";
import { LIST_COPY, type FilterKey } from "../constants/list";
import { useListItems, type ListItem } from "../hooks/use-list-items";
import { usePassages } from "../hooks/use-passages";
import { ListEmpty } from "./list-empty";
import { ListFilters } from "./list-filters";
import { ListSkeleton } from "./list-skeleton";
import { PassageCard } from "./passage-card";
import { ResumeDialog } from "./resume-dialog";
import { StartDialog } from "./start-dialog";

function matches(filter: FilterKey, item: ListItem) {
    if (filter === "all") return true;
    if (filter === "in_progress") {
        return item.state.kind === "in_progress";
    }
    return item.state.kind === filter;
}

export function ReadingListView() {
    const router = useRouter();

    const { passages, dataUpdatedAt, isPending, isError, refetch } = usePassages();
    const items = useListItems({ passages, dataUpdatedAt });

    const [filter, setFilter] = useState<FilterKey>("all");
    const [startItem, setStartItem] = useState<ListItem | null>(null);
    const [resumeItem, setResumeItem] = useState<ListItem | null>(null);

    function handleSelect(item: ListItem) {
        switch (item.state.kind) {
            case "new":
                setStartItem(item);
                break;
            case "in_progress":
                setResumeItem(item);
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
                    emptyType={filter === "in_progress" ? "ongoing" : "passages"}
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
        </>
    );
}
