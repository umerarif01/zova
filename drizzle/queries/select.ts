"use server";

import { sql, count, eq, and, or, like, asc } from "drizzle-orm";
import {
  chatbots,
  conversations,
  kbSources,
  messages as _messages,
  tokens,
  subscriptions,
  users,
} from "../schema";
import { db } from "../db";
import { auth } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function getChatbots() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  return await db
    .select({
      id: chatbots.id,
      name: chatbots.name,
      createdAt: chatbots.createdAt,
      conversationsCount: sql<number>`cast(count(distinct ${conversations.id}) as integer)`,
      sourcesCount: sql<number>`cast(count(distinct ${kbSources.id}) as integer)`,
    })
    .from(chatbots)
    .leftJoin(conversations, eq(conversations.chatbotId, chatbots.id))
    .leftJoin(kbSources, eq(kbSources.chatbotId, chatbots.id))
    .groupBy(chatbots.id)
    .where(eq(chatbots.userId, session.user.id as string));
}

export async function getChatbotById(chatbotId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  return await db
    .select()
    .from(chatbots)
    .where(
      and(
        eq(chatbots.id, chatbotId),
        eq(chatbots.userId, session.user.id as string)
      )
    );
}

export async function getConversations(chatbotId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  return await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.chatbotId, chatbotId),
        eq(conversations.userId, session.user.id as string)
      )
    );
}

export async function getKbSources(chatbotId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  try {
    const sources = await db
      .select()
      .from(kbSources)
      .where(
        and(
          eq(kbSources.chatbotId, chatbotId),
          eq(kbSources.userId, session?.user?.id as string)
        )
      );
    revalidatePath(`/dashboard/chatbot/${chatbotId}/train`);
    return sources;
  } catch (error) {
    console.error("Error fetching KB sources:", error);
    return [];
  }
}

export async function getKbSourcesForChatPage(chatbotId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  try {
    const sources = await db
      .select({
        id: kbSources.id,
        name: kbSources.name,
        type: kbSources.type,
        sourceUrl: kbSources.sourceUrl,
        chatbotId: kbSources.chatbotId,
        userId: kbSources.userId,
        createdAt: kbSources.createdAt,
      })
      .from(kbSources)
      .where(
        and(
          eq(kbSources.chatbotId, chatbotId),
          eq(kbSources.userId, session?.user?.id as string)
        )
      );
    return sources;
  } catch (error) {
    console.error("Error fetching KB sources:", error);
    return [];
  }
}

export async function getMessages(chatId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  try {
    const messages = await db
      .select()
      .from(_messages)
      .where(eq(_messages.conversationId, chatId));
    // .orderBy(asc(_messages.id));
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
export async function getTokens(chatbotId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  return await db
    .select()
    .from(tokens)
    .where(
      and(
        eq(tokens.chatbotId, chatbotId),
        eq(tokens.userId, session.user.id as string)
      )
    );
}

export async function getUserSubscriptionByStripeCustomerId(
  customerId: string
) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getUserSubscriptionByUserId(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getUserIdFromChatbot(chatbotId: string) {
  try {
    const result = await db
      .select({
        userId: chatbots.userId,
      })
      .from(chatbots)
      .where(eq(chatbots.id, chatbotId));

    if (!result.length) {
      throw new Error(`No chatbot found with id: ${chatbotId}`);
    }

    if (!result[0].userId) {
      throw new Error(`No userId found for chatbot: ${chatbotId}`);
    }

    return result[0].userId;
  } catch (error) {
    console.error("Error getting userId from chatbot:", error);
    throw error;
  }
}

export async function getChatbotByIdWithoutUserId(chatbotId: string) {
  return await db
    .select({
      name: chatbots.name,
      welcomeMessage: chatbots.welcomeMessage,
      background: chatbots.background,
      textColor: chatbots.textColor,
    })
    .from(chatbots)
    .where(eq(chatbots.id, chatbotId));
}

export async function getTotalUserCount(searchTerm: string = "") {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select({
      totalUsers: count(),
    })
    .from(users)
    .where(
      or(
        like(users.name, `%${searchTerm}%`),
        like(users.email, `%${searchTerm}%`)
      )
    );

  return result[0].totalUsers;
}

export async function selectAllUsers(
  page: number,
  pageSize: number,
  searchTerm: string = ""
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // Calculate the offset
  const offset = (page - 1) * pageSize;

  const result = await db
    .select()
    .from(users)
    .where(
      and(
        or(
          like(users.name, `%${searchTerm}%`),
          like(users.email, `%${searchTerm}%`)
        )
      )
    )
    .orderBy(asc(users.id)) // Ensure ordering
    .limit(pageSize)
    .offset(offset); // Apply offset for pagination

  return result;
}

export async function userDetails(userId: string) {
  const result = await db
    .select({
      userId: users.id,
      noOfTokens: users.noOfTokens,
      noOfChatbots: users.noOfChatbots,
      noOfKnowledgeSources: users.noOfKnowledgeSources,
      planName: subscriptions.planName,
    })
    .from(users)
    .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
    .where(eq(users.id, userId));
  return result;
}
