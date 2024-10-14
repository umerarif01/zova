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

interface ConversationCardProps {
  title: string;
  createdAt: string;
}

const ConversationCard = ({ title, createdAt }: ConversationCardProps) => {
  return (
    <Card className="w-full max-w-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
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
  );
};

export default ConversationCard;
