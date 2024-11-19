import { prepareDocument } from "@/utils/ingestion/prepare-document";
import { embedDocument } from "@/utils/ingestion/embed-document";
import { getPineconeClient } from "@/utils/pinecone";
import { convertToAscii } from "@/lib/utils";

export async function loadTextIntoPinecone(text: string, chatbotId: string) {
  try {
    // 1. Prepare the text document
    const documents = await prepareDocument({
      pageContent: text,
      metadata: { loc: { pageNumber: 1 } },
    });

    // 2. Vectorize and embed
    const vectors = await Promise.all(documents.map(embedDocument));

    // 3. Upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("zova-01");
    const namespace = pineconeIndex.namespace(convertToAscii(chatbotId));

    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);

    return documents[0];
  } catch (error) {
    console.error("Error processing text:", error);
    throw error;
  }
}
