import { PassageEditor } from "../../_components/passage-editor";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PassageEditor id={id} />;
}
