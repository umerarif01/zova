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
import TxtIcon from "@/public/txtfile.png";
import { UploadIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function TXTUploadDialog() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "text/plain") {
      setFile(selectedFile);
    } else {
      alert("Please select a TXT file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"] },
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
              src={TxtIcon}
              alt="TXT Icon"
              width={50}
              height={50}
              className="w-6 h-6 sm:w-8 sm:h-8 dark:invert transition-transform duration-300 group-hover:scale-110"
            />
            <span className="mt-2 text-xs sm:text-sm font-medium text-foreground">
              TXT
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>TXT File Upload</DialogTitle>
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
                ? "Drop the TXT file here"
                : "Drag and drop a TXT file here, or tap to select"}
            </div>
            <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold">
              {file ? "File selected" : "Upload TXT"}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload TXT files for the bot to learn from
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
