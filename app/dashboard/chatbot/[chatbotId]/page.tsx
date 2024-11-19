import { Button } from "@/components/ui/button";
import { Loader, PlusIcon } from "lucide-react";
import ConversationCard from "./_components/conversation-card";
import { Suspense } from "react";
import UserConversations from "./_components/user-conversations";
import CreateConversationButton from "./_components/create-conversation-button";

export default async function ChatbotPage(props: {
  params: Promise<{ chatbotId: string }>;
}) {
  const params = await props.params;

  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Recent Conversations
        </h2>
        <CreateConversationButton chatbotId={params.chatbotId} />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-10 w-full">
            <Loader className="animate-spin" />
          </div>
        }
      >
        <UserConversations chatbotId={params.chatbotId} />
      </Suspense>
    </div>
  );
}
