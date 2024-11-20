"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createConversation } from "@/drizzle/queries/insert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateConversationButtonProps {
  chatbotId: string;
}

const CreateConversationButton = ({
  chatbotId,
}: CreateConversationButtonProps) => {
  const session = useSession();
  const router = useRouter();

  const { mutate: createNewConversation, isPending } = useMutation({
    mutationFn: () =>
      createConversation({
        userId: session.data?.user?.id as string,
        chatbotId,
      }),

    onSuccess: (data) => {
      if (data?.success && data.id) {
        toast.success(data.message);
        router.push(`/chat/${chatbotId}/${data.id}`);
        router.refresh();
      } else {
        toast.error(data?.message || "An error occurred");
      }
    },
  });

  return (
    <Button
      variant="outline"
      className="mt-4 sm:mt-0 flex items-center"
      size="sm"
      onClick={() => createNewConversation()}
      disabled={isPending}
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      New Conversation
    </Button>
  );
};

export default CreateConversationButton;
