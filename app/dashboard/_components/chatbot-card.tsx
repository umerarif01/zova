import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

interface ChatbotCardProps {
  id: string;
  title: string;
  chatCount: number;
  sourceCount: number;
  createdAt: string;
}

export default function ChatbotCard({
  id,
  title,
  chatCount,
  sourceCount,
  createdAt,
}: ChatbotCardProps) {
  return (
    <Link href={`/dashboard/chatbot/${id}`}>
      <Card className="w-full min-h-[130px] flex flex-col justify-between p-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0 mb-2">
          <CardTitle className="text-base sm:text-lg font-bold line-clamp-2">
            {title}
          </CardTitle>
          <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer flex-shrink-0 mt-1 transition-colors duration-300 ease-in-out hover:text-gray-700" />
        </CardHeader>
        <CardFooter className="flex flex-col xs:flex-row justify-between items-start xs:items-center w-full gap-2 p-0">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full text-xs px-2 py-0.5 transition-colors duration-300 ease-in-out bg-purple-500 text-white hover:bg-primary hover:text-primary-foreground">
              {chatCount} Chat{chatCount !== 1 && "s"}
            </Badge>
            <Badge className="rounded-full text-xs px-2 py-0.5 transition-colors duration-300 ease-in-out bg-purple-500 text-white hover:bg-primary hover:text-primary-foreground">
              {sourceCount} Source{sourceCount !== 1 && "s"}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Created {createdAt}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
