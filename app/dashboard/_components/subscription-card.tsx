import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubscriptionCard() {
  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          Team Subscription
        </CardTitle>
        <Button variant="outline" size="sm">
          Manage Subscription
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h3 className="text-base font-medium">Current Plan: Free</h3>
          <p className="text-sm text-muted-foreground">
            No active subscription
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
