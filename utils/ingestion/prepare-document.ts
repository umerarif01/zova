import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

type Page = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
    url?: string;
  };
};

export async function prepareDocument(page: Page) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");

  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
