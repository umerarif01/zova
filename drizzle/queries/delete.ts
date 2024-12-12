"use server";

import { auth } from "@/utils/auth";
import { db } from "../db";
import { conversations } from "../schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function deleteChat(chatId: string) {
  const session = await auth();

  if (!session) {
    return { success: false, message: "You must be signed in to use this" };
  }

  try {
    await db.delete(conversations).where(eq(conversations.id, chatId));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while deleting the conversation.",
    };
  }
}
