import { Button } from "@/components/ui/button";
import { FileTextIcon, UploadIcon } from "lucide-react";
import PDFUploadDialog from "@/app/dashboard/chatbot/_components/pdf-dialog";
import URLInputDialog from "@/app/dashboard/chatbot/_components/url-input-dialog";
import TXTUploadDialog from "@/app/dashboard/chatbot/_components/txt-upload-dialog";
import CustomTextDialog from "@/app/dashboard/chatbot/_components/custom-text-dialog";
import DocumentUploadDialog from "@/app/dashboard/chatbot/_components/document-upload-dialog";
import SitemapInputDialog from "@/app/dashboard/chatbot/_components/sitemap-input-dialog";
import CSVUploadDialog from "@/app/dashboard/chatbot/_components/csv-upload-dialog";
import { columns, DataSource } from "../../_components/columns";
import { DataTableWithFeatures } from "../../_components/data-table-with-features";

// Dummy data
const data: DataSource[] = [
  {
    id: "1",
    type: "PDF",
    sourceName: "Company Report 2023.pdf",
    status: "Completed",
  },
  {
    id: "2",
    type: "URL",
    sourceName: "https://example.com/blog",
    status: "Processing",
  },
  {
    id: "3",
    type: "TXT",
    sourceName: "product_descriptions.txt",
    status: "Completed",
  },
  {
    id: "4",
    type: "Text",
    sourceName: "FAQ Content",
    status: "Completed",
  },
  {
    id: "5",
    type: "Document",
    sourceName: "User Manual.docx",
    status: "Failed",
  },
];

export default function TrainPage() {
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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-muted-foreground font-medium ml-2">
            3/5 data sources completed
          </span>
        </div>
        <DataTableWithFeatures columns={columns} data={data} />
      </div>
    </div>
  );
}
