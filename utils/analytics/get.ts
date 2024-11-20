"use server";

import { db } from "@/drizzle/db";
import { tokens, responses, conversationCounts } from "@/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { auth } from "@/utils/auth";

export async function getTokenAnalytics(chatbotId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  const result = await db
    .select({
      date: tokens.date,
      tokens: tokens.dailyTokens,
    })
    .from(tokens)
    .where(
      and(
        eq(tokens.chatbotId, chatbotId),
        eq(tokens.userId, session.user.id as string)
      )
    );

  return result.map((row) => ({
    date: row.date.toISOString().split("T")[0],
    tokens: row.tokens,
  }));
}

export async function getResponsesAnalytics(chatbotId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  const result = await db
    .select({
      date: responses.date,
      responses: responses.dailyResponses,
    })
    .from(responses)
    .where(
      and(
        eq(responses.chatbotId, chatbotId),
        eq(responses.userId, session.user.id as string)
      )
    );

  const chartData = result.map((row) => ({
    date: row.date.toISOString().split("T")[0],
    responses: row.responses,
  }));

  return chartData;
}

export async function getConversationAnalytics(chatbotId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be signed in to use this");
  }

  const result = await db
    .select({
      date: conversationCounts.date,
      chats: conversationCounts.conversationCount,
    })
    .from(conversationCounts)
    .where(
      and(
        eq(conversationCounts.chatbotId, chatbotId),
        eq(conversationCounts.userId, session.user.id as string)
      )
    );

  const chartData = result.map((row) => ({
    date: row.date.toISOString().split("T")[0],
    chats: row.chats,
  }));

  return chartData;
}
