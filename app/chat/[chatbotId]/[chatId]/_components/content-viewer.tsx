"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[90vh] flex items-center justify-center bg-gray-100">
      Loading PDF viewer...
    </div>
  ),
});

interface ContentViewerProps {
  source: {
    type: string;
    sourceUrl: string;
  };
}

export default function ContentViewer({ source }: ContentViewerProps) {
  const officeFormats = [
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "odt",
    "ods",
    "odp",
  ];

  if (!source.sourceUrl) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center bg-gray-100">
        No content available
      </div>
    );
  }

  const fileExtension = source.type.toLowerCase();

  switch (source.type) {
    case "pdf":
      return <PDFViewer pdfUrl={source.sourceUrl} />;

    case "text":
      return (
        <div className="w-full h-[90vh] p-6 overflow-auto bg-white">
          <pre className="whitespace-pre-wrap font-sans">
            {source.sourceUrl}{" "}
            {/* For text type, sourceUrl contains the text content */}
          </pre>
        </div>
      );

    case "markdown":
      return (
        <div className="w-full h-[90vh] p-6 overflow-auto bg-white prose max-w-none">
          <pre className="whitespace-pre-wrap font-sans">
            {source.sourceUrl}
          </pre>
        </div>
      );

    case "url":
      return (
        <iframe
          src={source.sourceUrl}
          width="100%"
          height="90vh"
          frameBorder="0"
          className="bg-white"
        />
      );

    default:
      if (officeFormats.includes(fileExtension)) {
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
              source.sourceUrl
            )}`}
            width="100%"
            height="90vh"
            frameBorder="0"
            className="bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title="Office document viewer"
          />
        );
      }

      return (
        <div className="w-full h-[90vh] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Unsupported file type: {source.type}
            </p>
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Download File
            </a>
          </div>
        </div>
      );
  }
}
