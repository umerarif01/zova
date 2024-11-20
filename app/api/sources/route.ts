import { NextRequest, NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { kbSources } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/utils/auth";

export async function GET(req: NextRequest) {
  const chatbotId = req.nextUrl.searchParams.get("chatbotId");

  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!chatbotId) {
    return NextResponse.json(
      { error: "Missing chatbotId parameter" },
      { status: 400 }
    );
  }

  const sources = await db
    .select()
    .from(kbSources)
    .where(
      and(
        eq(kbSources.chatbotId, chatbotId),
        eq(kbSources.userId, session?.user?.id as string)
      )
    );

  return NextResponse.json(sources);
}
