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
import { useDropzone } from "react-dropzone";
import { useParams } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { uploadToS3 } from "@/utils/s3";

export default function TXTUploadDialog() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async (data: { file_key: string; file_name: string }) => {
      const response = await axios.post("/api/ingest-source", {
        ...data,
        type: "txt",
        chatbotId: params.chatbotId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Text file added to knowledge base!");
      setFile(null);
      queryClient.invalidateQueries({
        queryKey: ["sources", params.chatbotId],
      });
    },
    onError: (err) => {
      toast.error("Error adding text file");
      console.error(err);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === "text/plain") {
      if (selectedFile.size > 4 * 1024 * 1024) {
        // Limit file size to 4MB
        toast.error("File size exceeds 4MB limit.");
        return;
      }
      setFile(selectedFile);
    } else {
      toast.error("Please select a TXT file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"] },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const { uploadUrl, file_key, file_name } = await uploadToS3({
        fileName: file.name,
        fileType: file.type,
        chatbotId: params.chatbotId as string,
      });

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!file_key || !file_name) {
        toast.error("Something went wrong");
        return;
      }

      setIsOpen(false);
      mutate({ file_key, file_name });
    } catch (error) {
      console.error(error);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <DialogTitle>Upload Text File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors ${
              isDragActive
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <p className="text-sm text-muted-foreground">{file.name}</p>
            ) : isDragActive ? (
              <p className="text-sm text-muted-foreground">
                Drop the file here
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Drag & drop a text file here, or click to select
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Upload a text file for the bot to learn from
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!file || uploading}
          variant="custom"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
