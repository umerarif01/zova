import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getChatbots } from "@/drizzle/queries/select";
import { auth } from "@/utils/auth";
import CreateChatbotDrawer from "./create-chatbot-drawer";
import ChatbotCard from "./chatbot-card";

interface UserChatbotsProps {}

const UserChatbots = async ({}: UserChatbotsProps) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  const chatbots = await getChatbots();

  if (chatbots.length === 0) {
    return (
      <main className="flex flex-col gap-2 lg:gap-2 min-h-[75vh] w-full">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              No Chatbots Created Yet
            </h1>
            <p className="text-xs md:text-sm max-w-sm text-muted-foreground mb-3 mx-4">
              Start creating your chatbots to see them here.
            </p>
            <CreateChatbotDrawer />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      {chatbots.map((chatbot) => (
        <ChatbotCard key={chatbot.id} {...chatbot} />
      ))}
    </div>
  );
};

export default UserChatbots;
