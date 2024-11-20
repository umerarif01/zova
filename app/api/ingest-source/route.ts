import { db } from "@/drizzle/db";
import { loadPDFIntoPinecone } from "@/utils/ingestion/pdf-ingestion";
import { loadURLIntoPinecone } from "@/utils/ingestion/url-ingestion";
import { loadDocxIntoPinecone } from "@/utils/ingestion/docx-ingestion";
import { loadTextIntoPinecone } from "@/utils/ingestion/text-ingestion";
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
    const { file_key, file_name, chatbotId, type, content } = body;

    if (!chatbotId || typeof chatbotId !== "string") {
      return NextResponse.json({ error: "invalid chatbotId" }, { status: 400 });
    }

    // Create the KB source record
    const [source] = await db
      .insert(kbSources)
      .values({
        chatbotId,
        userId: session.user.id,
        name: file_name || content, // Fallback to content if file_name is null
        type: type,
        sourceKey: type === "url" ? content : file_key || "",
        sourceUrl:
          type === "url" ? content : file_key ? await getS3Url(file_key) : "",
        status: "processing",
      } as typeof kbSources.$inferInsert)
      .returning();

    // Process in background based on type
    let processPromise;
    switch (type) {
      case "pdf":
        processPromise = loadPDFIntoPinecone(file_key, chatbotId);
        break;
      case "url":
        processPromise = loadURLIntoPinecone(content, chatbotId);
        break;
      case "docx":
        processPromise = loadDocxIntoPinecone(file_key, chatbotId);
        break;
      case "text":
        processPromise = loadTextIntoPinecone(content, chatbotId);
        break;
      default:
        throw new Error("Unsupported file type");
    }

    processPromise
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
