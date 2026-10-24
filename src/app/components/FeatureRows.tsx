import FeatureRow from "./FeatureRow";

export default function FeatureRows() {
  return (
    <>
      <FeatureRow
        eyebrow="Review"
        title="See exactly why you were wrong"
        lead="Not just a score. For every question you see the evidence sentence in the passage and the phrases that mean the same thing in different words."
        bullets={[
          "Evidence sentence highlighted in the passage",
          "Paraphrase pairs shown side by side",
          "A lesson suggested for each mistake",
        ]}
        imageLabel="Review page screenshot"
        image={`/images/landing/Review_Image.png`}
      />
      <FeatureRow
        eyebrow="Practice"
        title="Turn every mistake into practice"
        lead="Each mistake becomes a short drill, a lesson and a Word Card that come back on a schedule, so you actually remember them."
        bullets={[
          "A 2–3 minute Paraphrase Trainer",
          "Word Cards with the sentence you found them in",
          "Spaced review after 1, 2, 4, 8 and 16 days",
        ]}
        imageLabel="Paraphrase Trainer screenshot"
        imageFirst
        image={`/images/landing/Practice_Image.png`}
      />
      <FeatureRow
        eyebrow="Writing"
        title="Get estimated Writing feedback"
        lead="Submit a Task 2 essay and get feedback on the four IELTS criteria, with strengths and specific suggestions to improve."
        bullets={[
          "Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy",
          "Strengths, weaknesses and next steps",
          "Clearly labeled as an estimate, not an official IELTS score",
        ]}
        imageLabel="Writing feedback screenshot"
        image={`/images/landing/Writing_Feedback_Dashboard.png`}
      />
    </>
  );
}