"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  User,
  Mail,
  Shield,
  MessageSquare,
  Coins,
  Database,
  CreditCard,
  Ban,
  UserX,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { getUserDetails } from "@/drizzle/queries/admin";
import UserIcon from "@/public/user-icon.webp";
import Image from "next/image";

interface UserDetailsDialogProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserDetails {
  id: string;
  image: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  noOfTokens: number | null;
  noOfKnowledgeSources: number | null;
  noOfChatbots: number | null;
  planName: string | null;
  banned: boolean;
}

export function UserDetailsDialog({
  userId,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  const { data: user, isLoading } = useQuery<UserDetails>({
    queryKey: ["userDetails", userId],
    queryFn: () => getUserDetails(userId),
    enabled: open,
  });

  const getMaxValues = (planName: string | null) => {
    const MAX_CHATBOTS =
      planName === "Pro Plan" || planName === "Pro Yearly"
        ? 5
        : planName === "Basic Yearly" || planName === "Basic Plan"
        ? 3
        : 1;
    const MAX_TOKENS =
      planName === "Pro Plan" || planName === "Pro Yearly"
        ? 1000000
        : planName === "Basic Yearly" || planName === "Basic Plan"
        ? 300000
        : 100000;
    const MAX_KNOWLEDGE_SOURCES =
      planName === "Pro Plan" || planName === "Pro Yearly"
        ? 300
        : planName === "Basic Yearly" || planName === "Basic Plan"
        ? 150
        : 50;
    return { MAX_CHATBOTS, MAX_TOKENS, MAX_KNOWLEDGE_SOURCES };
  };

  const maxValues = getMaxValues(user?.planName || "free");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-24 h-24 mb-4">
                  {user?.image ? (
                    <Image
                      src={user.image || UserIcon}
                      alt="User Profile"
                      width={100}
                      height={100}
                      className="object-cover rounded-full"
                      priority
                    />
                  ) : (
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-2xl font-semibold">
                  {user?.name || "N/A"}
                </h2>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{user?.role || "N/A"}</Badge>
                  {user?.banned && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <Ban className="w-3 h-3" /> Banned
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={user?.email ?? "N/A"}
                />
                <DetailItem
                  icon={MessageSquare}
                  label="Chatbots"
                  value={`${user?.noOfChatbots ?? 0} / ${
                    maxValues.MAX_CHATBOTS
                  }`}
                  progress={
                    ((user?.noOfChatbots ?? 0) / maxValues.MAX_CHATBOTS) * 100
                  }
                />
                <DetailItem
                  icon={Coins}
                  label="Tokens"
                  value={`${user?.noOfTokens ?? 0} / ${maxValues.MAX_TOKENS}`}
                  progress={
                    ((user?.noOfTokens ?? 0) / maxValues.MAX_TOKENS) * 100
                  }
                />
                <DetailItem
                  icon={Database}
                  label="Knowledge Sources"
                  value={`${user?.noOfKnowledgeSources ?? 0} / ${
                    maxValues.MAX_KNOWLEDGE_SOURCES
                  }`}
                  progress={
                    ((user?.noOfKnowledgeSources ?? 0) /
                      maxValues.MAX_KNOWLEDGE_SOURCES) *
                    100
                  }
                />
                <DetailItem
                  icon={CreditCard}
                  label="Plan"
                  value={user?.planName ?? "N/A"}
                />
                <DetailItem
                  icon={UserX}
                  label="Ban Status"
                  value={user?.banned == true ? "True" : "False"}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  progress,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null;
  progress?: number;
}) {
  return (
    <div className="flex items-center space-x-4">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div className="space-y-1 flex-1">
        <p className="text-sm font-medium leading-none">{label}</p>
        <p className="text-sm text-muted-foreground">{value ?? "N/A"}</p>
        {progress !== undefined && (
          <Progress value={progress} className="h-1 mt-2" />
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
