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

    console.log("Context", context);

    const systemPrompt = `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.`;

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: messages.filter((message: Message) => message.role === "user"),

      async onFinish({ text, usage }) {
        // Save ai message into db
        await db.insert(_messages).values({
          conversationId: chatId,
          content: text,
          role: "system",
        });
        // Update the response count
        await incrementResponseCount(chatbotId);

        // Update the token count
        await incrementTokenCount(chatbotId, usage.totalTokens);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {}
}
