import TrainPageClient from "./_components/train-page-client";

export const fetchCache = "force-no-store";

export default async function TrainPage(props: {
  params: Promise<{ chatbotId: string }>;
}) {
  const resolvedParams = await props.params;

  return <TrainPageClient params={resolvedParams} />;
}
