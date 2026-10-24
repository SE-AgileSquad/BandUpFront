import SectionHeading from "./SectionHeading";

const steps = [
  {
    title: "Take a Reading test",
    description:
      "Timed passages with True / False / Not Given and Sentence Completion questions.",
  },
  {
    title: "See why you were wrong",
    description:
      "The evidence sentence is highlighted in the passage, with paraphrase pairs side by side.",
  },
  {
    title: "Practice what you missed",
    description:
      "Short lessons, paraphrase drills and Word Cards come straight from your mistakes.",
  },
  {
    title: "Review at the right time",
    description:
      "Items return after 1, 2, 4, 8 and 16 days until you really know them.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-muted px-6 py-14 lg:px-[120px] lg:py-24">
      <div className="mx-auto flex w-full max-w-content flex-col gap-8 lg:gap-14">
        <SectionHeading
          eyebrow="How it works"
          title="A loop that turns every mistake into progress"
          lead="Take a test, see exactly why you went wrong, practice it, and review it again at the right time."
        />

        <div className="grid gap-4 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-body font-medium text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="text-h4 font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-body text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}