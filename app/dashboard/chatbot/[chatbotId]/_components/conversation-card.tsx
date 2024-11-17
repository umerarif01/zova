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
import { MoreVertical } from "lucide-react";
import Link from "next/link";

interface ConversationCardProps {
  conversationId: string;
  title: string;
  createdAt: string;
}

const ConversationCard = ({
  title,
  createdAt,
  conversationId,
}: ConversationCardProps) => {
  return (
    <Link href={`/chat/${conversationId}`}>
      <Card className="w-full max-w-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105 bg-background dark:bg-[#0c0c0d]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </CardHeader>
        <CardFooter>
          <p className="text-sm text-muted-foreground">{createdAt}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ConversationCard;
