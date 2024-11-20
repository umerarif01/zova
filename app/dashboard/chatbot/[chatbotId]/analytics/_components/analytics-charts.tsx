"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { ChatbotChatsChart } from "./chatbot-chats-chart";
import { ChatbotResponsesChart } from "./chatbot-responses-chart";
import { ChatbotTokensChart } from "./chatbot-tokens-chart";
import {
  getConversationAnalytics,
  getResponsesAnalytics,
  getTokenAnalytics,
} from "@/utils/analytics/get";

export function AnalyticsCharts({ chatbotId }: { chatbotId: string }) {
  const chatsQuery = useQuery({
    queryKey: ["chatbot-chats", chatbotId],
    queryFn: async () => getConversationAnalytics(chatbotId),
  });

  const responsesQuery = useQuery({
    queryKey: ["chatbot-responses", chatbotId],
    queryFn: () => getResponsesAnalytics(chatbotId),
  });

  const tokensQuery = useQuery({
    queryKey: ["chatbot-tokens", chatbotId],
    queryFn: () => getTokenAnalytics(chatbotId),
  });

  const isLoading =
    chatsQuery.isLoading || responsesQuery.isLoading || tokensQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center w-full">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 w-full">
      <div className="lg:col-span-1">
        <ChatbotChatsChart chatbotId={chatbotId} />
      </div>
      <div className="lg:col-span-1">
        <ChatbotResponsesChart chatbotId={chatbotId} />
      </div>
      <div className="col-span-1 lg:col-span-2">
        <ChatbotTokensChart chatbotId={chatbotId} />
      </div>
    </div>
  );
}
