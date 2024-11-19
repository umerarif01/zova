"use server";

import { db } from "@/drizzle/db";
import { kbSources } from "@/drizzle/schema";
import { deleteFromS3 } from "../s3-server";
import { eq } from "drizzle-orm";
import { getPineconeClient } from "../pinecone";
import { convertToAscii } from "../../lib/utils";
import { revalidatePath } from "next/cache";

export async function deleteSource(sourceId: string) {
  // Get the source
  const [source] = await db
    .select()
    .from(kbSources)
    .where(eq(kbSources.id, sourceId));

  if (!source) {
    throw new Error("Source not found");
  }

  // Delete from S3 if it's a file
  if (source.sourceKey) {
    await deleteFromS3(source.sourceKey);
  }

  //   // Delete from Pinecone
  //   const client = await getPineconeClient();
  //   const pineconeIndex = await client.index("zova-01");
  //   const namespace = pineconeIndex.namespace(convertToAscii(source.chatbotId));
  //   await namespace.deleteAll(); // This deletes all vectors for this source in the namespace

  // Delete from database
  await db.delete(kbSources).where(eq(kbSources.id, sourceId));

  revalidatePath(`/dashboard/chatbot/${source.chatbotId}/train`);

  return { message: "Source deleted successfully" };
}
