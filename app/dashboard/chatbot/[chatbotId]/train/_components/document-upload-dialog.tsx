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
import DocIcon from "@/public/doc.png";
import { UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function DocumentUploadDialog() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      alert("Please select a valid document file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.oasis.opendocument.text": [".odt"],
      "application/rtf": [".rtf"],
    },
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
          <div className="size-20 sm:size-24 border border-border rounded-lg flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-purple-600">
            <Image
              src={DocIcon}
              alt="Document Icon"
              width={50}
              height={50}
              className="w-6 h-6 sm:w-8 sm:h-8 dark:invert transition-transform duration-300 group-hover:scale-110"
            />
            <span className="mt-2 text-xs sm:text-sm font-medium text-foreground">
              Doc
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Document Upload</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto mb-2 sm:mb-4 h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
            <div className="text-sm">
              {file
                ? file.name
                : isDragActive
                ? "Drop the document here"
                : "Drag and drop a document here, or tap to select"}
            </div>
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold">
              {file ? "File selected" : "Upload Document"}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload document files (DOC, DOCX, ODT, RTF) for the bot to learn
            from
          </p>
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
