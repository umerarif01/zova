import { getRecentSubscriptions } from "@/drizzle/queries/admin";
import { formatDistance } from "date-fns";
import { UserCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RecentSubscriptions() {
  const subscriptions = await getRecentSubscriptions();

  return (
    <Card className="w-full col-span-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          Recent Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 max-h-[400px] overflow-y-auto">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src={sub.user?.image || undefined} />
                <AvatarFallback>
                  <UserCircle className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{sub.user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {sub.user?.email}
                </p>
              </div>
            </div>
            <Badge
              variant={sub.planName ? "default" : "destructive"}
              className="ml-auto"
            >
              {sub.planName}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
