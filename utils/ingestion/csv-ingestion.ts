import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { prepareDocument } from "@/utils/ingestion/prepare-document";
import { embedDocument } from "@/utils/ingestion/embed-document";
import { getPineconeClient } from "@/utils/pinecone";
import { convertToAscii } from "@/lib/utils";
import { downloadFromS3 } from "../s3-server";

export async function loadCSVIntoPinecone(
  sourceKey: string,
  chatbotId: string
) {
  try {
    // 1. Download the DOCX file
    console.log("downloading txt from s3");
    const fileBuffer = await downloadFromS3(sourceKey);
    if (!fileBuffer) {
      throw new Error("could not download from s3");
    }

    // 2. Load DOCX
    console.log("loading csv into memory");
    const loader = new CSVLoader(new Blob([fileBuffer]));
    const pages = await loader.load();

    // 3. Split and segment the content
    const documents = await Promise.all(
      pages.map((page) =>
        prepareDocument({
          pageContent: page.pageContent,
          metadata: { loc: { pageNumber: 1 } },
        })
      )
    );

    // 4. Vectorize and embed
    const vectors = await Promise.all(
      documents.flat().map((doc, index) => embedDocument(doc, sourceKey))
    );

    // 5. Upload to pinecone
    const client = await getPineconeClient();
    const pineconeIndex = await client.index(process.env.PINECONE_NAMESPACE!);
    const namespace = pineconeIndex.namespace(convertToAscii(chatbotId));

    console.log("inserting vectors into pinecone");
    await namespace.upsert(vectors);

    return documents[0];
  } catch (error) {
    console.error("Error processing DOCX:", error);
    throw error;
  }
}
