"use server";

import { revalidatePath } from "next/cache";
import {
  chatbots,
  conversations,
  InsertChatbot,
  InsertConversation,
  subscriptions,
} from "../schema";
import { db } from "../db";
import { auth } from "@/utils/auth";
import { incrementConversationCount } from "@/utils/analytics/update";

export async function createChatbot(data: InsertChatbot) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("You must be signed in to use this");
    }

    const [result] = await db.insert(chatbots).values(data).returning();
    console.log("result", result);
    if (result?.id) {
      revalidatePath("/dashboard");
      return { success: true, message: "Chatbot created successfully" };
    } else {
      return { success: false, message: "Failed to create chatbot" };
    }
  } catch (error) {
    console.error("Error creating chatbot:", error);
    return {
      success: false,
      message: "An error occurred while creating the chatbot",
    };
  }
}

export const createConversation = async ({
  userId,
  chatbotId,
}: {
  userId: string;
  chatbotId: string;
}) => {
  try {
    const newConversation = await db
      .insert(conversations)
      .values({
        userId,
        chatbotId,
      })
      .returning();

    if (newConversation[0]) {
      // Update the conversation count
      await incrementConversationCount(userId, chatbotId);

      return {
        success: true,
        message: "Conversation created successfully",
        id: newConversation[0].id,
      };
    }
  } catch (error) {
    console.error("Error creating conversation:", error);
    return {
      success: false,
      message: "An error occurred while creating the conversation",
    };
  }
};

export async function insertUserSubscription(data: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripeProductId: string;
  planName: string;
  subscriptionStatus: string;
}) {
  const [result] = await db
    .insert(subscriptions)
    .values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result;
}
