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
import { useDropzone } from "react-dropzone";
import { useParams } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { uploadToS3 } from "@/utils/s3";
import { Loader } from "lucide-react";

export default function DocumentUploadDialog() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility

  const { mutate } = useMutation({
    mutationFn: async (data: { file_key: string; file_name: string }) => {
      const response = await axios.post("/api/ingest-source", {
        ...data,
        type: "docx",
        chatbotId: params.chatbotId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Document added to knowledge base!");
      setFile(null);
      setIsOpen(false); // Close the modal after successful upload
      queryClient.invalidateQueries({
        queryKey: ["sources", params.chatbotId],
      });
    },
    onError: (err) => {
      toast.error("Error adding document");
      console.error(err);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        // Limit file size to 4MB
        toast.error("File size exceeds 4MB limit.");
        return;
      }
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid document file.");
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
              src={DocIcon}
              alt="Document Icon"
              width={50}
              height={50}
              className="w-6 h-6 sm:w-8 sm:h-8 dark:invert transition-transform duration-300 group-hover:scale-110"
            />
            <span className="mt-2 text-xs sm:text-sm font-medium text-foreground">
              Docx
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
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
                Drag & drop a document here, or click to select
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Supported formats: .doc, .docx, .odt, .rtf
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!file || uploading}
            variant="custom"
          >
            {uploading ? (
              <>
                <Loader className="animate-spin w-4 h-4 mr-2" />
                Uploading Docx...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
