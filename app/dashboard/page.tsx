import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Loader, MoreVertical, PlusIcon } from "lucide-react";
import ChatbotCard from "./_components/chatbot-card";
import CreateChatbotDrawer from "./_components/create-chatbot-drawer";
import UserChatbots from "./_components/user-chatbots";
import { Suspense } from "react";
import { auth } from "@/utils/auth";
import { userDetails } from "@/drizzle/queries/select";

export default async function Dashboard() {
  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Recent Chatbots
        </h2>
        <CreateChatbotDrawer />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-10 w-full">
            <Loader className="animate-spin" />
          </div>
        }
      >
        <UserChatbots />
      </Suspense>
    </div>
  );
}
