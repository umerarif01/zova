"use server";

import { db } from "../db";
import { eq } from "drizzle-orm";
import { chatbots, DrizzleChatbot, subscriptions } from "../schema";
import { auth } from "@/utils/auth";

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

export async function updateChatbot(chatbotData: DrizzleChatbot) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(chatbots)
    .set(chatbotData)
    .where(eq(chatbots.id, chatbotData.id));
}
