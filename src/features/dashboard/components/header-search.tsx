"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SEARCH_PATH, SEARCH_QUERY_MAX_LENGTH } from "../constants/dashboard.constants";
import { headerSearchSchema } from "../schemas/header-search.schema";

export function HeaderSearch() {
    const router = useRouter();
    const [value, setValue] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const parsed = headerSearchSchema.safeParse({ q: value });

        if (!parsed.success) {
            return;
        }

        router.push(`${SEARCH_PATH}?q=${encodeURIComponent(parsed.data.q)}`);
    };

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className="flex h-10 w-[280px] items-center gap-2 rounded-lg bg-muted px-3 focus-within:ring-2 focus-within:ring-ring"
        >
            <Search className="size-[18px] shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
                type="search"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                maxLength={SEARCH_QUERY_MAX_LENGTH}
                aria-label="Search lessons and passages"
                placeholder="Search lessons and passages…"
                className="w-full border-0 bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground"
            />
        </form>
    );
}