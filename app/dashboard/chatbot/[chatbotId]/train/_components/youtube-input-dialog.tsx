"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { YoutubeIcon, PlusIcon, TrashIcon, Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function YoutubeInputDialog() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [urls, setUrls] = useState<string[]>([""]);
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  const { mutate, isPending } = useMutation({
    mutationFn: async (url: string) => {
      // Validate and transform YouTube URLs
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (!youtubeRegex.test(url)) {
        throw new Error("Invalid YouTube URL");
      }

      const response = await axios.post(
        process.env.NEXT_PUBLIC_ZOVA_INGEST_BACKEND!,
        {
          type: "yt",
          content: url,
          userId: session.data?.user.id,
          file_name: `youtube-${new Date().getTime()}`,
          chatbotId: params.chatbotId,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("YouTube video added to knowledge base!");
      queryClient.invalidateQueries({
        queryKey: ["sources", params.chatbotId],
      });
    },
    onError: (err) => {
      toast.error("Error adding YouTube video");
      console.error(err);
    },
  });

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = async () => {
    const validUrls = urls.filter((url) => url.trim() !== "");
    if (validUrls.length > 0) {
      try {
        for (const url of validUrls) {
          await mutate(url);
        }
        setIsOpen(false);
        setUrls([""]);

        queryClient.invalidateQueries({
          queryKey: ["sources", params.chatbotId],
        });
      } catch (error) {
        console.error("Error processing YouTube URLs:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="size-20 sm:size-24 border border-border rounded-lg flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-purple-600">
            <YoutubeIcon
              className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110 "
              strokeWidth={0.9}
            />
            <span className="mt-2 text-xs sm:text-sm font-medium text-foreground">
              YouTube
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add YouTube Videos</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {urls.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <YoutubeIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder="Enter YouTube URL"
                className="flex-grow"
              />
              {urls.length > 1 && (
                <Button
                  onClick={() => removeUrlField(index)}
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="sr-only">Remove URL</span>
                </Button>
              )}
            </div>
          ))}
          <Button onClick={addUrlField} variant="outline" className="w-full">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Another Video
          </Button>
          <p className="text-sm text-muted-foreground">
            Enter YouTube video URLs for the bot to learn from
          </p>
        </div>
        <Button
          variant="custom"
          onClick={handleSubmit}
          className="w-full"
          disabled={urls.every((url) => url.trim() === "") || isPending}
        >
          {isPending ? (
            <>
              <Loader className="animate-spin w-4 h-4 mr-2" />
              Processing Videos...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
