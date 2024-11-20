"use server";

import { db } from "@/drizzle/db";
import { tokens, responses, conversationCounts } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { auth } from "@/utils/auth";

export async function incrementTokenCount(
  chatbotId: string,
  tokenCount: number
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Try to update existing record first
  const result = await db
    .update(tokens)
    .set({
      dailyTokens: sql`${tokens.dailyTokens} + ${tokenCount}`,
    })
    .where(
      and(
        eq(tokens.chatbotId, chatbotId),
        eq(tokens.userId, session.user.id as string),
        eq(tokens.date, today)
      )
    )
    .returning();

  // If no record was updated, create a new one
  if (result.length === 0) {
    await db.insert(tokens).values({
      chatbotId,
      userId: session.user.id as string,
      dailyTokens: tokenCount,
      date: today,
    });
  }
}

export async function incrementResponseCount(chatbotId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Try to update existing record first
  const result = await db
    .update(responses)
    .set({
      dailyResponses: sql`${responses.dailyResponses} + 1`,
    })
    .where(
      and(
        eq(responses.chatbotId, chatbotId),
        eq(responses.userId, session.user.id as string),
        eq(responses.date, today)
      )
    )
    .returning();

  // If no record was updated, create a new one
  if (result.length === 0) {
    await db.insert(responses).values({
      chatbotId,
      userId: session.user.id as string,
      dailyResponses: 1,
      date: today,
    });
  }
}

export async function incrementConversationCount(
  userId: string,
  chatbotId: string
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Try to update existing record first
  const result = await db
    .update(conversationCounts)
    .set({
      conversationCount: sql`${conversationCounts.conversationCount} + 1`,
    })
    .where(
      and(
        eq(conversationCounts.userId, userId),
        eq(conversationCounts.chatbotId, chatbotId),
        eq(conversationCounts.date, today)
      )
    )
    .returning();

  // If no record was updated, create a new one
  if (result.length === 0) {
    await db.insert(conversationCounts).values({
      userId,
      chatbotId,
      conversationCount: 1,
      date: today,
    });
  }
}
