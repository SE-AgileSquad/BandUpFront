import Eyebrow from "./Eyebrow";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lead: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  lead,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto flex w-full max-w-full flex-col items-center gap-3 text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-h2-sm font-bold text-foreground lg:text-h2">
        {title}
      </h2>
      <p className="text-lead text-muted-foreground">{lead}</p>
    </div>
  );
}