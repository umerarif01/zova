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
import { getUserDetails } from "@/drizzle/queries/admin";

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
                    <img src={user.image} alt={user.name || "User"} />
                  ) : (
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-2xl font-semibold">
                  {user?.name || "N/A"}
                </h2>
                <Badge variant="secondary" className="mt-2">
                  {user?.role || "N/A"}
                </Badge>
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
                  value={user?.noOfChatbots ?? "N/A"}
                />
                <DetailItem
                  icon={Coins}
                  label="Tokens"
                  value={user?.noOfTokens ?? "N/A"}
                />
                <DetailItem
                  icon={Database}
                  label="Knowledge Sources"
                  value={user?.noOfKnowledgeSources ?? "N/A"}
                />
                <DetailItem
                  icon={CreditCard}
                  label="Plan"
                  value={user?.planName ?? "N/A"}
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
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="flex items-center space-x-4">
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{label}</p>
        <p className="text-sm text-muted-foreground">{value ?? "N/A"}</p>
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
