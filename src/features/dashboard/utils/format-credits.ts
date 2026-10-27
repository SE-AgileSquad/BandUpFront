export function formatCredits(credits: number): string {
  return `${credits} ${credits === 1 ? "credit" : "credits"}`;
}