import { LessonEditor } from "../../_components/lesson-editor";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LessonEditor id={id} />;
}
