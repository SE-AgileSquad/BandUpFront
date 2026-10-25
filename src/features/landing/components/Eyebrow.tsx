import type { ReactNode } from "react";

export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-small font-semibold uppercase tracking-[0.06em] text-primary">
      {children}
    </p>
  );
}