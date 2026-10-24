import Link from "next/link";
import Logo from "@/components/Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Lessons", href: "/lessons" },
      { label: "Reading Tests", href: "/reading-tests" },
      { label: "Paraphrase Trainer", href: "/paraphrase-trainer" },
      { label: "Word Cards", href: "/word-cards" },
      { label: "Writing", href: "/writing" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Sign up", href: "/sign-up" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

export default function MainFooter() {
  return (
    <footer className="bg-muted">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 pb-6 pt-10 md:px-[120px] md:pb-8 md:pt-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-10 md:h-[246px] md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-x-8 md:pb-0">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Logo />
            <p className="max-w-[280px] text-body text-muted-foreground">
              Prepare for IELTS Reading and Writing — and learn from every
              mistake.
            </p>
          </div>

          {columns.map((column) => (
            <div
              key={column.title}
              className={`flex flex-col gap-4 ${
                column.title === "Company" ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <h3 className="text-body font-medium text-foreground">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-6 md:h-[71px] md:flex-row md:items-center md:justify-between md:gap-0 md:pt-0">
          <span className="text-small text-muted-foreground">
            © 2026 BandUp. All rights reserved.
          </span>
          <span className="text-small text-muted-foreground">
            BandUp is not affiliated with IELTS owners.
          </span>
        </div>
      </div>
    </footer>
  );
}