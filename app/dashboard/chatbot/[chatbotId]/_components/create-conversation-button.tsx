import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface CreateConversationButtonProps {
  chatbotId: string;
}

const CreateConversationButton = ({
  chatbotId,
}: CreateConversationButtonProps) => {
  return (
    <Button
      variant="outline"
      className="mt-4 sm:mt-0 flex items-center"
      size="sm"
    >
      <PlusIcon className="mr-2 h-4 w-4" /> New Conversation
    </Button>
  );
};

export default CreateConversationButton;
