import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { AnalyticsCharts } from "./_components/analytics-charts";

export default async function AnalyticsPage(props: {
  params: Promise<{ chatbotId: string }>;
}) {
  const params = await props.params;

  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Chatbot Analytics
        </h2>
        <Button
          variant="outline"
          className="mt-4 sm:mt-0 flex items-center"
          size={"sm"}
        >
          <DownloadIcon className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>
      <AnalyticsCharts chatbotId={params.chatbotId} />
    </div>
  );
}
