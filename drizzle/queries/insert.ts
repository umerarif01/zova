"use server";

import { revalidatePath } from "next/cache";
import {
  chatbots,
  conversations,
  InsertChatbot,
  InsertConversation,
  kbSources,
  subscriptions,
} from "../schema";
import { db } from "../db";
import { auth } from "@/utils/auth";
import { incrementConversationCount } from "@/utils/analytics/update";
import { getS3Url } from "@/utils/s3";
import { getUserIdFromChatbot } from "./select";

export async function createChatbot(data: InsertChatbot) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("You must be signed in to use this");
    }

    const [result] = await db.insert(chatbots).values(data).returning();
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

export async function createConversationWithoutUserId(chatbotId: string) {
  try {
    console.log("chatbotId", chatbotId);

    const userId = await getUserIdFromChatbot(chatbotId);

    if (!userId) {
      console.error("user id not found");
      return;
    }

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
}

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

export async function insertKbSource(
  chatbotId: string,
  userId: string,
  name: string,
  type: "pdf" | "url" | "docx" | "text" | "txt",
  sourceKey: string,
  sourceUrl: string,
  content?: string
): Promise<string> {
  if (!["pdf", "url", "docx", "text"].includes(type)) {
    throw new Error(`Unsupported file type: ${type}`);
  }

  const commonValues = {
    chatbotId,
    userId,
    name: name,
    type: type,
    status: "processing",
  };

  let insertValues;

  switch (type) {
    case "pdf":
      insertValues = {
        ...commonValues,
        sourcKey: await getS3Url(sourceKey),
        sourceUrl,
      };
      break;
    case "url":
      insertValues = {
        ...commonValues,
        sourceKey: content ?? sourceKey,
        sourceUrl: content ?? sourceUrl,
      };
      break;
    case "txt":
      insertValues = {
        ...commonValues,
        sourcKey: await getS3Url(sourceKey),
        sourceUrl,
      };
    case "docx":
      insertValues = {
        ...commonValues,
        sourcKey: await getS3Url(sourceKey),
        sourceUrl,
      };
    case "text":
      insertValues = {
        ...commonValues,
        sourceKey: content ?? sourceKey,
        sourceUrl: content ?? sourceUrl,
      };
      break;
    default:
      throw new Error(`Unhandled file type: ${type}`);
  }

  // Insert the KB source record
  const [source] = await db
    .insert(kbSources)
    .values(insertValues as typeof kbSources.$inferInsert)
    .returning();

  return source.id;
}
