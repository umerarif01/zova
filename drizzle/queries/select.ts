"use server";

import { sql, count, eq, and } from "drizzle-orm";
import {
  chatbots,
  conversations,
  kbSources,
  messages as _messages,
  tokens,
} from "../schema";
import { db } from "../db";
import { auth } from "@/utils/auth";

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
      conversationsCount: sql<number>`cast(count(${conversations.id}) as integer)`,
      sourcesCount: sql<number>`cast(count(${kbSources.id}) as integer)`,
    })
    .from(chatbots)
    .leftJoin(conversations, eq(conversations.chatbotId, chatbots.id))
    .leftJoin(kbSources, eq(kbSources.chatbotId, chatbots.id))
    .groupBy(chatbots.id)
    .where(eq(chatbots.userId, session.user.id as string));
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
          eq(kbSources.userId, session.user.id as string)
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
