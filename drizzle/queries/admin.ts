"use server";

import { db } from "@/drizzle/db";
import {
  users,
  subscriptions,
  chatbots,
  kbSources,
  messages,
  tokens,
  conversationCounts,
  responses,
  recentSubscriptions,
} from "@/drizzle/schema";
import { auth } from "@/utils/auth";
import { and, count } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { eq, gte, sql } from "drizzle-orm";

export async function getAdminDashboardStats() {
  const session = await auth(); // Assuming you have a function to get the session

  if (!session || session.user.role !== "admin") {
    throw new Error("You must be an admin to access user details");
  }

  const [
    activeSubscriptionsCount,
    totalUsersCount,
    totalKnowledgeSourcesCount,
    totalChatbotsCount,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.subscriptionStatus, "active")),
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(kbSources),
    db.select({ count: count() }).from(chatbots),
  ]);

  return {
    activeSubscriptions: activeSubscriptionsCount[0].count,
    totalUsers: totalUsersCount[0].count,
    totalKnowledgeSources: totalKnowledgeSourcesCount[0].count,
    totalChatbots: totalChatbotsCount[0].count,
  };
}

export async function getRecentSubscriptions(limit: number = 5) {
  return db
    .select({
      id: recentSubscriptions.id,
      planName: recentSubscriptions.planName,
      createdAt: recentSubscriptions.createdAt,
      userId: recentSubscriptions.userId,
      user: {
        name: users.name,
        email: users.email,
        image: users.image,
      },
    })
    .from(recentSubscriptions)
    .leftJoin(users, eq(users.id, recentSubscriptions.userId))
    .orderBy(desc(recentSubscriptions.createdAt))
    .limit(limit);
}

export async function getAnalytics(days: number = 30) {
  const session = await auth(); // Assuming you have a function to get the session

  if (!session || session.user.role !== "admin") {
    throw new Error("You must be an admin to access user details");
  }
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const tokensResult = await db
    .select({
      date: tokens.date,
      tokens: tokens.dailyTokens,
    })
    .from(tokens);

  const responsesResult = await db
    .select({
      date: responses.date,
      responses: responses.dailyResponses,
    })
    .from(responses);

  const conversationResult = await db
    .select({
      date: conversationCounts.date,
      chats: conversationCounts.conversationCount,
    })
    .from(conversationCounts);

  const tokensData = tokensResult.map((row) => ({
    date: row.date.toISOString().split("T")[0],
    tokens: row.tokens,
  }));

  const responsesData = responsesResult.map((row) => ({
    date: row.date.toISOString().split("T")[0],
    responses: row.responses,
  }));

  const conversationData = conversationResult.map((row) => ({
    date: row.date.toISOString().split("T")[0],
    chats: row.chats,
  }));

  return {
    tokens: tokensData,
    responses: responsesData,
    conversations: conversationData,
  };
}

export const getUserDetails = async (userId: string) => {
  const session = await auth(); // Assuming you have a function to get the session

  if (!session || session.user.role !== "admin") {
    throw new Error("You must be an admin to access user details");
  }

  const userDetailsResult = await db
    .select({
      id: users.id,
      image: users.image,
      name: users.name,
      email: users.email,
      role: users.role,
      noOfTokens: users.noOfTokens,
      noOfKnowledgeSources: users.noOfKnowledgeSources,
      noOfChatbots: users.noOfChatbots,
      planName: subscriptions.planName,
    })
    .from(users)
    .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
    .where(eq(users.id, userId));

  return userDetailsResult[0]; // Return the first result
};

export async function updateUserRole(userId: string, newRole: string) {
  const session = await auth(); // Assuming you have a function to get the session

  if (!session || session.user.role !== "admin") {
    throw new Error("You must be an admin to update user roles");
  }

  const updateResult = await db
    .update(users)
    .set({ role: newRole })
    .where(eq(users.id, userId));

  return updateResult;
}
