import { db } from "../db";
import { eq } from "drizzle-orm";
import { subscriptions } from "../schema";

export async function updateUserSubscription(
  subscriptionId: string,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(subscriptions)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionId));
}
