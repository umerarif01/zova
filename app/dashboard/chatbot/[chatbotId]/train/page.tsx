import TrainPageClient from "./_components/train-page-client";

export default async function TrainPage(props: {
  params: Promise<{ chatbotId: string }>;
}) {
  const resolvedParams = await props.params;

  return <TrainPageClient params={resolvedParams} />;
}
