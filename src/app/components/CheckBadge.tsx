import { Check } from "lucide-react";

const sizes = {
  18: "size-[18px]",
  20: "size-5",
};

export default function CheckBadge({ size = 20 }: { size?: 18 | 20 }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent text-primary ${sizes[size]}`}
    >
      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
    </span>
  );
}