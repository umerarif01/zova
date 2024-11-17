import { db } from "@/drizzle/db";
import { loadS3IntoPinecone } from "@/utils/pinecone";
import { getS3Url } from "@/utils/s3";
import { NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { kbSources } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { file_key, file_name, chatbotId } = body;

    if (!chatbotId || typeof chatbotId !== "string") {
      return NextResponse.json({ error: "invalid chatbotId" }, { status: 400 });
    }

    // First create the KB source record
    const [source] = await db
      .insert(kbSources)
      .values({
        chatbotId,
        userId: session.user.id,
        name: file_name,
        type: "pdf",
        sourceKey: file_key,
        sourceUrl: await getS3Url(file_key),
        status: "processing",
      } as typeof kbSources.$inferInsert)
      .returning();

    // Process in background
    loadS3IntoPinecone(file_key, chatbotId)
      .then(async () => {
        await db
          .update(kbSources)
          .set({ status: "completed" })
          .where(eq(kbSources.id, source.id));
      })
      .catch(async (error) => {
        console.error("Failed to process document:", error);
        await db
          .update(kbSources)
          .set({ status: "failed" })
          .where(eq(kbSources.id, source.id));
      });

    return NextResponse.json({ sourceId: source.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
