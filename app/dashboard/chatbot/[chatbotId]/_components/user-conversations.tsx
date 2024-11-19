import React from "react";
import { getChatbots, getConversations } from "@/drizzle/queries/select";
import { auth } from "@/utils/auth";
import ConversationCard from "./conversation-card";
import CreateConversationButton from "./create-conversation-button";

interface UserConversationsProps {
  chatbotId: string;
}

const UserConversations = async ({ chatbotId }: UserConversationsProps) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  const conversations = await getConversations(chatbotId);

  if (conversations.length === 0) {
    return (
      <main className="flex flex-col gap-2 lg:gap-2 min-h-[75vh] w-full">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Start Your First Conversation
            </h1>
            <p className="text-xs md:text-sm max-w-sm text-muted-foreground mb-3 mx-4">
              Begin chatting with your AI agent by creating a new conversation.
              Your chat history will appear here.
            </p>
            <CreateConversationButton chatbotId={chatbotId} />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.id} {...conversation} />
      ))}
    </div>
  );
};

export default UserConversations;
