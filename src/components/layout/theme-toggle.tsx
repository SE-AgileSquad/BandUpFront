"use client";

import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

type ThemeName = (typeof options)[number]["value"];
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="brand-outline"
        size="icon-lg"
        aria-label="Toggle theme"
        className={className}
        disabled
      >
        <Sun className="size-5" />
      </Button>
    );
  }

  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  function changeTheme(nextTheme: ThemeName) {
    const root = document.documentElement;
    const nextIsDark = nextTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : nextTheme === "dark";
    const updateTheme = () => {
      flushSync(() => {
        root.classList.toggle("dark", nextIsDark);
        setTheme(nextTheme);
      });
    };

    const transitionDocument = document as ViewTransitionDocument;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!transitionDocument.startViewTransition || reduceMotion || root.classList.contains("dark") === nextIsDark) {
      setTheme(nextTheme);
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    );

    const transition = transitionDocument.startViewTransition(updateTheme);
    void transition.ready.then(() => {
      root.animate(
        [
          { clipPath: `circle(0px at ${originX}px ${originY}px)` },
          { clipPath: `circle(${radius}px at ${originX}px ${originY}px)` },
        ],
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }).catch(() => undefined);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={triggerRef}
          variant="brand-outline"
          size="icon-lg"
          aria-label="Toggle theme"
          className={className}
        >
          <Icon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map(({ value, label, icon: ItemIcon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => changeTheme(value)}
            data-active={theme === value}
            className="data-[active=true]:text-primary"
          >
            <ItemIcon className="size-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
