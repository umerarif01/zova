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
import { Loader, Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useParams } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { uploadToS3 } from "@/utils/s3";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { updateTokens } from "@/drizzle/queries/update";

export default function ImageUploadDialog() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { file_key: string; file_name: string }) => {
      await updateTokens(session?.data?.user.id || "");
      const response = await axios.post(
        process.env.NEXT_PUBLIC_ZOVA_INGEST_BACKEND!,
        {
          ...data,
          type: "img",
          userId: session.data?.user.id,
          chatbotId: params.chatbotId,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        "Your image is being processed! Please don't close the app."
      );
      setFile(null);
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["sources", params.chatbotId],
      });
    },
    onError: (err) => {
      toast.error("Error adding image");
      console.error(err);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast.error("File size exceeds 4MB limit.");
        return;
      }
      setFile(selectedFile);
    } else {
      toast.error("Please select an image file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
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

      mutate({ file_key, file_name });

      queryClient.invalidateQueries({
        queryKey: ["sources", params.chatbotId],
      });
    } catch (error) {
      console.error(error);
      toast.error("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="size-20 sm:size-24 border border-border rounded-lg flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-purple-600">
            <ImageIcon
              className="w-6 h-6 sm:w-8 sm:h-8 dark:invert transition-transform duration-300 group-hover:scale-110"
              strokeWidth={0.9}
            />

            <span className="mt-2 text-xs sm:text-sm font-medium text-foreground">
              Image
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground mb-2">
            Note: Image to text will consume 1000 tokens.
          </p>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors ${
              isDragActive
                ? "border-purple-500 bg-purple-50/50"
                : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <ImageIcon className="mb-4" strokeWidth={0.9} />
                <p className="text-sm text-muted-foreground">{file.name}</p>
              </div>
            ) : isDragActive ? (
              <div className="text-purple-500 text-center">
                <p className="text-sm font-medium">Drop the file here</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="mb-4" />
                <p className="text-sm text-muted-foreground mb-1 text-center">
                  Drag & drop an image file here, or click to select
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Maximum file size: 4mb
                </p>
              </div>
            )}
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!file || isPending || isUploading}
          variant="custom"
        >
          {isPending || isUploading ? (
            <>
              <Loader className="animate-spin w-4 h-4 mr-2" />
              Uploading Image
            </>
          ) : (
            "Upload Image"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
