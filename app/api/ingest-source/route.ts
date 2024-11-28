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
import { insertKbSource } from "@/drizzle/queries/insert";
import { loadTxtIntoPinecone } from "@/utils/ingestion/txt-ingestion";
import { incrementUserSourcesCount } from "@/drizzle/queries/update";
import { loadCSVIntoPinecone } from "@/utils/ingestion/csv-ingestion";

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

    const sourceId = await insertKbSource(
      chatbotId,
      session.user.id,
      file_name,
      type,
      file_key,
      file_key,
      content ?? ""
    );
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
      case "txt":
        processPromise = loadTxtIntoPinecone(file_key, chatbotId);
        break;
      case "csv":
        processPromise = loadCSVIntoPinecone(file_key, chatbotId);
        break;
      default:
        throw new Error("Unsupported file type");
    }

    processPromise
      .then(async () => {
        await db
          .update(kbSources)
          .set({ status: "completed" })
          .where(eq(kbSources.id, sourceId));
        await incrementUserSourcesCount(session.user.id);
      })
      .catch(async (error) => {
        console.error("Failed to process document:", error);
        await db
          .update(kbSources)
          .set({ status: "failed" })
          .where(eq(kbSources.id, sourceId));
      });

    return NextResponse.json({ sourceId: sourceId }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
