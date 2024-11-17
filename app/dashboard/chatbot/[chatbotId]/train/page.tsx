import PDFUploadDialog from "./_components/pdf-dialog";
import URLInputDialog from "./_components/url-input-dialog";
import TXTUploadDialog from "./_components/txt-upload-dialog";
import CustomTextDialog from "./_components/custom-text-dialog";
import DocumentUploadDialog from "./_components/document-upload-dialog";
import SitemapInputDialog from "./_components/sitemap-input-dialog";
import CSVUploadDialog from "./_components/csv-upload-dialog";
import { columns } from "./_components/columns";
import { DataTableWithFeatures } from "./_components/data-table-with-features";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { kbSources } from "@/drizzle/schema";
import { KBSource } from "@/types/kb-source";

export default async function TrainPage(props: {
  params: Promise<{ chatbotId: string }>;
}) {
  const params = await props.params;
  const sources = await db
    .select()
    .from(kbSources)
    .where(eq(kbSources.chatbotId, params.chatbotId));

  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Train Your Chatbot
        </h2>
      </div>
      <h3 className="text-base md:text-lg font-medium text-muted-foreground">
        Choose a source of data to add to your bot:
      </h3>
      <div className="flex flex-wrap gap-4">
        <PDFUploadDialog />
        <URLInputDialog />
        <TXTUploadDialog />
        <CustomTextDialog />
        <DocumentUploadDialog />
        <SitemapInputDialog />
        <CSVUploadDialog />
      </div>
      <div className="w-full mt-8">
        <div className="flex items-center space-x-2 border-b pb-4">
          <span className="relative flex h-3 w-3">
            {sources.length > 0 ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-300"></span>
            )}
          </span>
          <span className="text-sm text-muted-foreground font-medium ml-2">
            {sources.length > 0 ? (
              <>
                {
                  sources.filter((source) => source.status === "completed")
                    .length
                }{" "}
                of {sources.length} data sources completed
              </>
            ) : (
              "No data sources yet"
            )}
          </span>
        </div>
        <DataTableWithFeatures<KBSource> columns={columns} data={sources} />
      </div>
    </div>
  );
}
