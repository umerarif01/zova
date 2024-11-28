import { Message, streamText } from "ai";
import { getContext } from "@/utils/context";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { conversations, messages as _messages } from "@/drizzle/schema";
import { openai } from "@ai-sdk/openai";
import {
  incrementResponseCount,
  incrementTokenCount,
} from "@/utils/analytics/update";
import { createConversationWithoutUserId } from "@/drizzle/queries/insert";
import { incrementUserTokensCount } from "@/drizzle/queries/update";
import { getUserIdFromChatbot } from "@/drizzle/queries/select";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, chatId, chatbotId } = await req.json();

    //Check if chat exists
    const _chats = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const lastMessage = messages[messages.length - 1];

    // If this is the first message, update the conversation's firstMessage
    if (messages.length === 1) {
      await db
        .update(conversations)
        .set({ firstMessage: lastMessage.content })
        .where(eq(conversations.id, chatId));
    }

    // Store the user message
    await db.insert(_messages).values({
      conversationId: chatId,
      content: lastMessage.content,
      role: "user",
    });

    const context = await getContext(lastMessage.content, chatbotId);

    const systemPrompt = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
    If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

    <context>
    ${context}
    </context>

    Please return your answer in markdown with clear headings and lists.`;

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: messages.filter((message: Message) => message.role === "user"),

      async onFinish({ text, usage }) {
        // Save ai message into db
        await db.insert(_messages).values({
          conversationId: chatId,
          content: text,
          role: "system",
        });
        // Get the userId
        const userId = await getUserIdFromChatbot(chatbotId);

        if (!userId) throw new Error("userId not found!");

        // Update the response count
        await incrementResponseCount(userId, chatbotId);

        // Update the token
        await incrementTokenCount(userId, chatbotId, usage.totalTokens);

        // Update user token count
        await incrementUserTokensCount(userId, usage.totalTokens);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
