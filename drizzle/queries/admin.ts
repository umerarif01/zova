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
import { eq, gte, sql, or, ilike } from "drizzle-orm";
import { Resend } from "resend";
import SourceDeleted from "@/components/emails/source-deleted";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY!);

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
      banned: users.banned,
    })
    .from(users)
    .leftJoin(subscriptions, eq(users.id, subscriptions.userId))
    .where(eq(users.id, userId));

  return userDetailsResult[0]; // Return the first result
};

export async function updateUserRole(formData: FormData) {
  const session = await auth(); // Assuming you have a function to get the session

  if (!session || session.user.role !== "admin") {
    throw new Error("You must be an admin to update user roles");
  }

  const userId = formData.get("userId") as string;
  const selectedRole = formData.get("selectedRole") as string;

  if (!userId || !selectedRole) {
    throw new Error("User ID and selected role must be provided");
  }

  const updateResult = await db
    .update(users)
    .set({ role: selectedRole })
    .where(eq(users.id, userId));

  if (updateResult) {
    return { message: "User role updated successfully" };
  } else {
    throw new Error("Failed to update user role");
  }
}

export async function banUser(userId: string, banOption: string) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    throw new Error("You must be an admin to ban user");
  }

  if (!userId) {
    throw new Error("User ID must be provided");
  }

  const updateResult = await db
    .update(users)
    .set({ banned: banOption === "true" })
    .where(eq(users.id, userId));

  if (updateResult) {
    revalidatePath("/admin");
    return { message: "User banned successfully" };
  } else {
    throw new Error("Failed to ban user");
  }
}

export async function getKnowledgeSources(
  userId: string,
  query: string = "",
  page: number = 1,
  pageSize: number = 10
) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    throw new Error("You must be an admin to access sources");
  }

  if (!userId) {
    throw new Error("User ID must be provided");
  }

  const offset = (page - 1) * pageSize;

  const sources = await db
    .select()
    .from(kbSources)
    .where(
      and(
        eq(kbSources.userId, userId),
        query
          ? or(
              ilike(kbSources.name, `%${query}%`),
              ilike(kbSources.type, `%${query}%`)
            )
          : undefined
      )
    )
    .limit(pageSize)
    .offset(offset)
    .orderBy(desc(kbSources.createdAt));

  const totalSources = await db
    .select({ count: sql<number>`count(*)` })
    .from(kbSources)
    .where(
      and(
        eq(kbSources.userId, userId),
        query
          ? or(
              ilike(kbSources.name, `%${query}%`),
              ilike(kbSources.type, `%${query}%`)
            )
          : undefined
      )
    );

  return {
    sources,
    totalSources: Number(totalSources[0].count),
  };
}

export async function deleteSource(
  sourceId: string,
  sendEmail: boolean = false
) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    throw new Error("You must be an admin to delete sources");
  }

  // Get source details before deletion
  const [source] = await db
    .select()
    .from(kbSources)
    .where(eq(kbSources.id, sourceId));

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, source.userId));

  if (!source) {
    throw new Error("Source not found");
  }

  // Delete the source
  await db.delete(kbSources).where(eq(kbSources.id, sourceId));

  // Send email if requested and email is available
  if (sendEmail && user.email) {
    await resend.emails.send({
      from: "Zova.chat <onboarding@resend.dev>",
      to: [user.email || ""],
      subject: "Knowledge Source Deleted",
      react: SourceDeleted({
        firstName: user.name || "",
        sourceName: source.name || "",
      }),
    });
  }

  revalidatePath("");

  return { success: true };
}
