"use server";

import { sql, count, eq } from "drizzle-orm";
import { chatbots, conversations, kbSources } from "../schema";
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
    .groupBy(chatbots.id);
}
