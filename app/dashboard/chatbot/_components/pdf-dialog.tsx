"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PdfIcon from "@/public/pdf-2.png";
import { UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function PDFUploadDialog() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleSubmit = () => {
    if (file) {
      // Here you would typically upload the file to your server
      console.log("Uploading file:", file.name);
      // Reset the file state after upload
      setFile(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="size-20 sm:size-24 border rounded-lg flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-purple-500">
            <Image
              src={PdfIcon}
              alt="PDF Icon"
              width={50}
              height={50}
              className="w-6 h-6 sm:w-8 sm:h-8 dark:invert transition-transform duration-300 group-hover:scale-110"
            />
            <span className="mt-2 text-xs sm:text-sm font-semibold">PDF</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[425px]">
        <DialogHeader>
          <DialogTitle>PDF</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto mb-2 sm:mb-4 h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            <div className="text-sm">
              {file
                ? file.name
                : isDragActive
                ? "Drop the PDF here"
                : "Drag and drop a PDF here, or tap to select"}
            </div>
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold">
              {file ? "File selected" : "Upload PDF"}
            </div>
          </div>
          <div className="text-xs sm:text-sm">
            Upload PDF files for the bot to learn from
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!file}
          variant="custom"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
