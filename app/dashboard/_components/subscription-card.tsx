import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DrizzleSubscription } from "@/drizzle/schema";
import { customerPortalAction } from "@/utils/payments/actions";
import Link from "next/link";

interface SubscriptionCardProps {
  userSubscription: DrizzleSubscription;
}

export default function SubscriptionCard({
  userSubscription,
}: SubscriptionCardProps) {
  const isSubscribed = userSubscription?.subscriptionStatus === "active";
  const planName = isSubscribed ? userSubscription?.planName : "Free";

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          Your Subscription
        </CardTitle>
        {planName === "Free" ? (
          <Link href="/pricing">
            <Button variant="outline">Upgrade to a Paid Plan</Button>
          </Link>
        ) : (
          <form action={customerPortalAction}>
            <Button type="submit" variant="outline">
              Manage Subscription
            </Button>
          </form>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h3 className="text-base font-medium">Current Plan: {planName}</h3>
          <p className="text-sm text-muted-foreground">
            {isSubscribed ? "Active subscription" : "No active subscription"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
