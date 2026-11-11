import Link from "next/link";
import type { NavLink } from "@/constants/navigation";
import { cn } from "@/lib/utils";

type FooterColumnProps = {
    title: string;
    links: NavLink[];
    pending?: boolean;
};

export function FooterColumn({ title, links, pending }: FooterColumnProps) {
    return (
        <div className="flex flex-col gap-[10px]">
            <p className="text-[13px] leading-[1.4] font-bold text-muted-foreground">
                {title}
            </p>
            <ul
                aria-hidden={pending}
                className={cn("flex flex-col gap-[10px]", pending && "invisible")}
            >
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="rounded-sm text-[14px] leading-[21px] font-medium text-foreground transition-colors outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}