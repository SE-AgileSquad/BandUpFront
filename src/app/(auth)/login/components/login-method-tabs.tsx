"use client";

import type { ReactNode } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { LOGIN_COPY } from "../constants/login";
import type { LoginMethod } from "../types";

type LoginMethodTabsProps = {
    value: LoginMethod;
    onValueChange: (method: LoginMethod) => void;
    password: ReactNode;
    email: ReactNode;
};

const triggerClass =
    "flex-1 rounded-[11px] py-[10px] text-[14px] leading-[21px] font-semibold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-primary";

export function LoginMethodTabs({
    value,
    onValueChange,
    password,
    email,
}: LoginMethodTabsProps) {
    return (
        <Tabs
            value={value}
            onValueChange={(next) => onValueChange(next as LoginMethod)}
        >
            <TabsList
                aria-label={LOGIN_COPY.tabsLabel}
                className="rounded-field bg-primary-soft p-1"
            >
                <TabsTrigger value="password" className={triggerClass}>
                    {LOGIN_COPY.tabs.password}
                </TabsTrigger>
                <TabsTrigger value="email" className={triggerClass}>
                    {LOGIN_COPY.tabs.email}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="password">{password}</TabsContent>
            <TabsContent value="email">{email}</TabsContent>
        </Tabs>
    );
}
