"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";
import PDFUploadDialog from "./pdf-dialog";
import URLInputDialog from "./url-input-dialog";
import TXTUploadDialog from "./txt-upload-dialog";
import CustomTextDialog from "./custom-text-dialog";
import DocumentUploadDialog from "./document-upload-dialog";
import SitemapInputDialog from "./sitemap-input-dialog";
import CSVUploadDialog from "./csv-upload-dialog";
import { columns } from "./columns";
import { DataTableWithFeatures } from "./data-table-with-features";
import { KBSource } from "@/types/kb-source";

export default function TrainPageClient({
  params,
}: {
  params: { chatbotId: string };
}) {
  const { data: sources = [], isLoading } = useQuery({
    queryKey: ["sources", params.chatbotId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/sources?chatbotId=${params.chatbotId}`
      );
      return response.data;
    },
  });

  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Train Your Chatbot
        </h2>
      </div>
      {isLoading ? (
        <div className="w-full flex items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <h3 className="text-base md:text-lg font-medium text-muted-foreground">
            Choose a source of data to add to your bot:
          </h3>
          <div className="flex flex-wrap gap-4">
            <PDFUploadDialog />
            <URLInputDialog />
            <TXTUploadDialog />
            <CustomTextDialog />
            <DocumentUploadDialog />
            {/* <SitemapInputDialog />
            <CSVUploadDialog /> */}
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
                      sources.filter(
                        (source: KBSource) => source.status === "completed"
                      ).length
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
        </>
      )}
    </div>
  );
}
