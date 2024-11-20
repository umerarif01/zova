import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { kbSources } from "@/drizzle/schema";
import { NextResponse } from "next/server";
import { auth } from "@/utils/auth";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatbotId = searchParams.get("chatbotId");

  if (!chatbotId) {
    return NextResponse.json(
      { error: "chatbotId is required" },
      { status: 400 }
    );
  }

  const sources = await db
    .select()
    .from(kbSources)
    .where(eq(kbSources.chatbotId, chatbotId));

  return NextResponse.json(sources);
}
