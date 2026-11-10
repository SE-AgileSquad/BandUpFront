import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeReadout } from "./_components/theme-readout";

const swatches = [
  { name: "background", cls: "bg-background" },
  { name: "card", cls: "bg-card" },
  { name: "border", cls: "bg-border" },
  { name: "primary", cls: "bg-primary" },
  { name: "primary-soft", cls: "bg-primary-soft" },
  { name: "foreground", cls: "bg-foreground" },
  { name: "muted-foreground", cls: "bg-muted-foreground" },
  { name: "gradient-from", cls: "bg-gradient-from" },
  { name: "gradient-to", cls: "bg-gradient-to" },
  { name: "on-gradient-cta", cls: "bg-on-gradient-cta" },
  { name: "success", cls: "bg-success" },
  { name: "warning", cls: "bg-warning" },
  { name: "destructive", cls: "bg-destructive" },
  { name: "info", cls: "bg-info" },
];

const typeScale = [
  { name: "display 68/74", cls: "text-display" },
  { name: "h1-cta 48/56", cls: "text-h1-cta" },
  { name: "h2 44/52", cls: "text-h2" },
  { name: "h3 34/42", cls: "text-h3" },
  { name: "card-title 18", cls: "text-card-title" },
  { name: "lead 17/26", cls: "text-lead" },
  { name: "body 16/24", cls: "text-body" },
  { name: "body-sm 14/21", cls: "text-body-sm" },
  { name: "nav 15 medium", cls: "text-nav" },
  { name: "button 15 semibold", cls: "text-button" },
  { name: "caption 13 medium", cls: "text-caption" },
  { name: "eyebrow", cls: "text-eyebrow" },
  { name: "logo 22 bold", cls: "text-logo" },
];

const radii = [
  { name: "logo 11", cls: "rounded-logo" },
  { name: "btn 16", cls: "rounded-btn" },
  { name: "frame 20", cls: "rounded-frame" },
  { name: "card 24", cls: "rounded-card" },
  { name: "banner 40", cls: "rounded-banner" },
  { name: "pill", cls: "rounded-pill" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-y border-b border-border last:border-b-0">
      <p className="text-eyebrow text-primary mb-6">{title}</p>
      {children}
    </section>
  );
}

export default function ThemeTestPage() {
  return (
    <main className="container-page">
      <header className="flex items-center justify-between py-6">
        <span className="text-logo">BandUp</span>
        <ThemeToggle />
      </header>

      <Section title="Theme state">
        <ThemeReadout />
      </Section>

      <Section title="Font: Inter">
        <div className="space-y-3 text-h3">
          <p className="font-normal">Regular 400 - The quick brown fox 0123456789</p>
          <p className="font-medium">Medium 500 - The quick brown fox 0123456789</p>
          <p className="font-semibold">Semibold 600 - The quick brown fox 0123456789</p>
          <p className="font-bold">Bold 700 - The quick brown fox 0123456789</p>
        </div>
      </Section>

      <Section title="Type scale (resize the window to check responsive sizes)">
        <div className="space-y-6">
          {typeScale.map(({ name, cls }) => (
            <div key={name} className="grid gap-1 md:grid-cols-[180px_1fr] md:items-baseline">
              <span className="text-caption text-muted-foreground">{name}</span>
              <p className={cls}>Prepare for IELTS with confidence</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {swatches.map(({ name, cls }) => (
            <div key={name} className="space-y-2">
              <div className={`${cls} h-16 rounded-btn border border-border`} />
              <p className="text-caption">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Gradient and CTA banner">
        <div className="bg-gradient-primary rounded-banner p-10 md:p-14">
          <h2 className="text-h1-cta text-primary-foreground">Start your free trial</h2>
          <p className="text-lead mt-3 !text-primary-foreground/80">
            Text on the gradient background.
          </p>
          <button
            type="button"
            className="text-button mt-6 rounded-btn bg-white px-6 py-3 text-on-gradient-cta"
          >
            Get started
          </button>
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap gap-4">
          {radii.map(({ name, cls }) => (
            <div
              key={name}
              className={`${cls} grid h-20 w-32 place-items-center border border-border bg-card text-caption`}
            >
              {name}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Components">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Badge>Badge</Badge>
          <Badge variant="outline">Outline badge</Badge>
        </div>
        <Card className="mt-6 max-w-sm rounded-card p-6">
          <h3 className="text-card-title">Card title</h3>
          <p className="text-body-sm mt-2 text-muted-foreground">
            Card on the surface color with a border.
          </p>
        </Card>
      </Section>
    </main>
  );
}