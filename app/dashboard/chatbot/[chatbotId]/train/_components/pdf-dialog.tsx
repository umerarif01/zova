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
import { toast } from "sonner";
import { uploadToS3 } from "@/utils/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function PDFUploadDialog() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/ingest-source", {
        file_key,
        file_name,
        chatbotId: params.chatbotId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setFile(null);
      setOpen(false);
      // Invalidate sources query to refresh the table
      queryClient.invalidateQueries({
        queryKey: ["sources", params.chatbotId],
      });
    },
    onError: (err) => {
      toast.error("Error uploading file");
      console.error(err);
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error("File too large");
        return;
      }
      setFile(file);
    },
  });

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chatbotId", params.chatbotId as string);
      const data = await uploadToS3(formData);
      console.log("s3 upload data:", data);
      if (!data?.file_key || !data.file_name) {
        toast.error("Something went wrong");
        return;
      }
      mutate(data, {
        onSuccess: ({ chat_id }) => {
          toast.success("Source added to knowledge base!");
          setFile(null);
        },
        onError: (err) => {
          toast.error("Error creating chat");
          console.error(err);
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          disabled={!file || uploading || isPending}
          variant="custom"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
