import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Delete, MoreVertical, Trash } from "lucide-react";
import Link from "next/link";
import { DrizzleConversation } from "@/drizzle/schema";
import { DeleteDialog } from "./delete-dialog";

type ConversationCardProps = DrizzleConversation;

const ConversationCard = ({
  id,
  chatbotId,
  firstMessage,
  createdAt,
}: ConversationCardProps) => {
  return (
    <div className="relative group">
      <Link href={`/chat/${chatbotId}/${id}`}>
        <Card className="w-full max-w-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg  bg-background dark:bg-[#0c0c0d]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {firstMessage
                ? firstMessage.length > 50
                  ? firstMessage.substring(0, 50) + "..."
                  : firstMessage
                : "New Conversation"}
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      </Link>
      <DeleteDialog chatId={id} />
    </div>
  );
};

export default ConversationCard;
