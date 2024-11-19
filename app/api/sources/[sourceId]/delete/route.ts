import { db } from "@/drizzle/db";
import { auth } from "@/utils/auth";
import { kbSources } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getPineconeClient } from "@/utils/pinecone";
import { convertToAscii } from "@/lib/utils";
import { deleteFromS3 } from "@/utils/s3-server";

export async function DELETE(props: { params: Promise<{ sourceId: string }> }) {
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

    // Delete from S3 if it's a file
    if (source.sourceKey) {
      await deleteFromS3(source.sourceKey);
    }

    // Delete from Pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("zova-01");
    const namespace = pineconeIndex.namespace(convertToAscii(source.chatbotId));
    await namespace.deleteAll(); // This deletes all vectors for this source in the namespace

    // Delete from database
    await db.delete(kbSources).where(eq(kbSources.id, params.sourceId));

    return NextResponse.json({ message: "Source deleted successfully" });
  } catch (error) {
    console.error("Error deleting source:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
