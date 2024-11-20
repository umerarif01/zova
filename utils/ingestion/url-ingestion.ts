import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { prepareDocument } from "./prepare-document";
import { embedDocument } from "./embed-document";
import { getPineconeClient } from "../pinecone";
import { convertToAscii } from "@/lib/utils";

export async function loadURLIntoPinecone(url: string, chatbotId: string) {
  try {
    // Ensure URL is properly formatted
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // 1. Load and parse webpage
    console.log("loading webpage content from:", url);
    const loader = new CheerioWebBaseLoader(url, {
      selector: "p, h1, h2, h3, h4, h5, h6, table, tr, td, th, li, dl, dt, dd",
    });
    const pages = await loader.load();

    if (!pages || pages.length === 0) {
      throw new Error("No content found on the webpage");
    }

    // 2. Split and segment the content
    console.log("preparing documents");
    const documents = await Promise.all(
      pages.map((page) =>
        prepareDocument({
          pageContent: page.pageContent,
          metadata: {
            loc: { pageNumber: 1 },
            url: url,
          },
        })
      )
    );

    // 3. Vectorize and embed
    console.log("creating embeddings");
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    if (vectors.length === 0) {
      throw new Error("No vectors created from the webpage content");
    }

    // 4. Upload to pinecone
    console.log("uploading to pinecone");
    const client = await getPineconeClient();
    const pineconeIndex = await client.index("zova-01");
    const namespace = pineconeIndex.namespace(convertToAscii(chatbotId));

    console.log(`inserting ${vectors.length} vectors into pinecone`);
    await namespace.upsert(vectors);

    return documents[0];
  } catch (error) {
    console.error("Error processing URL:", error);
    throw error;
  }
}
