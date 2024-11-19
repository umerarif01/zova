import { db } from "@/drizzle/db";
import { auth } from "@/utils/auth";
import { kbSources } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { loadPDFIntoPinecone } from "@/utils/ingestion/pdf-ingestion";
import { loadURLIntoPinecone } from "@/utils/ingestion/url-ingestion";
import { loadDocxIntoPinecone } from "@/utils/ingestion/docx-ingestion";
import { loadTextIntoPinecone } from "@/utils/ingestion/text-ingestion";

export async function POST(props: { params: Promise<{ sourceId: string }> }) {
  try {
    const params = await props.params;

    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the source
    const [source] = await db
      .select()
      .from(kbSources)
      .where(eq(kbSources.id, params.sourceId));

    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    // Update status to processing
    await db
      .update(kbSources)
      .set({ status: "processing" })
      .where(eq(kbSources.id, params.sourceId));

    // Process based on type
    let processPromise;
    switch (source.type) {
      case "pdf":
        processPromise = loadPDFIntoPinecone(
          source.sourceKey,
          source.chatbotId
        );
        break;
      case "url":
        processPromise = loadURLIntoPinecone(
          source.sourceUrl,
          source.chatbotId
        );
        break;
      case "docx":
        processPromise = loadDocxIntoPinecone(
          source.sourceKey,
          source.chatbotId
        );
        break;
      case "text":
        processPromise = loadTextIntoPinecone(
          source.sourceUrl,
          source.chatbotId
        );
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

    return NextResponse.json({ message: "Resync started" });
  } catch (error) {
    console.error("Error resyncing source:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
