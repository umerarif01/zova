"use server";

import { revalidatePath } from "next/cache";
import { chatbots, InsertChatbot } from "../schema";
import { db } from "../db";
import { auth } from "@/utils/auth";

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
