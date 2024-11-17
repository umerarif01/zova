import { db } from "@/drizzle/db";
import { kbSources } from "@/drizzle/schema";
import { auth } from "@/utils/auth";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatbotId = searchParams.get("chatbotId");

  if (!chatbotId) {
    return NextResponse.json({ error: "chatbotId required" }, { status: 400 });
  }

  const sources = await db
    .select()
    .from(kbSources)
    .where(eq(kbSources.chatbotId, chatbotId))
    .orderBy(desc(kbSources.createdAt));

  return NextResponse.json({ sources }, { status: 200 });
}
