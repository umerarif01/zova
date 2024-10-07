import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { MoreVertical, PlusIcon } from "lucide-react";
import ChatbotCard from "./_components/chatbot-card";

const chatbots = [
  {
    title: "Chatbot ABC",
    chatCount: 2,
    sourceCount: 5,
    createdAt: "2 days ago",
  },
  {
    title: "Chatbot XYZ",
    chatCount: 1,
    sourceCount: 3,
    createdAt: "1 week ago",
  },
];

export default async function Dashboard() {
  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Recent Chatbots
        </h2>
        <Button
          variant="outline"
          className="mt-4 sm:mt-0 flex items-center"
          size={"sm"}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Create Chatbot
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {chatbots.map((chatbot, index) => (
          <ChatbotCard key={index} {...chatbot} />
        ))}
      </div>
    </div>
  );
}
