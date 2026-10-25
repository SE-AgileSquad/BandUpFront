import { BarChart3, MessageCircle, Search } from "lucide-react";
import SectionHeading from "./SectionHeading";

const tools = [
  {
    icon: MessageCircle,
    title: "Ask BandUp",
    description:
      "Get answers from BandUp's own lessons and passages, with the sources shown.",
    tag: "AI-generated from BandUp content",
  },
  {
    icon: Search,
    title: "Search in plain English",
    description:
      "Describe what you're looking for and find the right lesson or passage by meaning.",
  },
  {
    icon: BarChart3,
    title: "Track your progress",
    description:
      "See your accuracy for each question type and what's due for review today.",
  },
];

export default function MoreTools() {
  return (
    <section className="bg-muted px-6 py-14 lg:px-[120px] lg:py-24">
      <div className="mx-auto flex w-full max-w-content flex-col gap-8 lg:gap-14">
        <SectionHeading
          eyebrow="And more"
          title="Everything you need to stay on track"
          lead="Ask questions, search your study material and see your progress, all in one place."
        />

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="flex flex-col gap-3.5 rounded-2xl border border-border bg-background p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                <tool.icon className="size-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <h3 className="text-h4 font-semibold text-foreground">
                {tool.title}
              </h3>
              <p className="text-body text-muted-foreground">
                {tool.description}
              </p>
              {tool.tag && (
                <span className="mt-auto self-start rounded-full bg-accent px-2.5 py-[3px] text-small text-primary">
                  {tool.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}