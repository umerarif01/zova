import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { ChatbotResponsesChart } from "../../_components/chatbot-responses-chart";
import { ChatbotChatsChart } from "../../_components/chatbot-chats-chart";
import { ChatbotTokensChart } from "../../_components/chatbot-tokens-chart";

export default function AnalyticsPage() {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 w-full">
        <div className="lg:col-span-1">
          <ChatbotChatsChart />
        </div>
        <div className="lg:col-span-1">
          <ChatbotResponsesChart />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ChatbotTokensChart />
        </div>
      </div>
    </div>
  );
}
