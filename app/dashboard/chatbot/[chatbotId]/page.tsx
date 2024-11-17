import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ConversationCard from "./_components/conversation-card";

const conversations = [
  {
    id: 1,
    chatbotId: "1",
    conversationId: "1",
    title: "What is Zova.chat?",
    createdAt: "1 day ago",
  },
  {
    id: 2,
    chatbotId: "1",
    conversationId: "2",
    title: "What is ABC?",
    createdAt: "1 day ago",
  },
  {
    id: 3,
    chatbotId: "1",
    conversationId: "3",
    title: "What is XYZ?",
    createdAt: "1 day ago",
  },
];

export default function ChatbotPage() {
  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Recent Conversations
        </h2>
        <Button
          variant="outline"
          className="mt-4 sm:mt-0 flex items-center"
          size={"sm"}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> New Conversation
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
        {conversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            title={conversation.title}
            createdAt={conversation.createdAt}
            conversationId={conversation.conversationId}
          />
        ))}
      </div>
    </div>
  );
}
