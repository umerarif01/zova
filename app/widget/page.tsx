"use client";

import { ChatbotWindow } from "@/app/widget/_components/window";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { getChatbotByIdWithoutUserId } from "@/drizzle/queries/select";
import { Suspense } from "react";

function WidgetContent() {
  const searchParams = useSearchParams();
  const chatbotId = searchParams.get("chatbotId");

  // Move the query logic into the hook, and handle no chatbotId scenario separately
  const { isLoading, error, data } = useQuery({
    queryKey: ["chatbot", chatbotId],
    queryFn: () => getChatbotByIdWithoutUserId(chatbotId!),
    enabled: !!chatbotId, // ensures the query only runs if chatbotId is truthy
  });

  if (!chatbotId) {
    return (
      <div className="flex h-screen items-center justify-center">
        Invalid chatbot ID
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-black">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        Error loading chatbot
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chatbot not found
      </div>
    );
  }

  const chatbot = data[0];

  return (
    <div className="h-screen bg-white">
      <ChatbotWindow
        embedded
        chatbotId={chatbotId}
        name={chatbot.name ?? undefined}
        welcomeMessage={chatbot.welcomeMessage ?? undefined}
        background={chatbot.background ?? undefined}
        textColor={chatbot.textColor ?? undefined}
      />
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WidgetContent />
    </Suspense>
  );
}
