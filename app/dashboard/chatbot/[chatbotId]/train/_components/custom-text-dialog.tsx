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
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import TextIcon from "@/public/txt.png";
import { useParams } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function CustomTextDialog() {
  const params = useParams();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State to control dialog visibility
  const session = useSession();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_ZOVA_INGEST_BACKEND!,
        {
          type: "text",
          content: text,
          file_name: "Custom Text",
          userId: session.data?.user.id,
          chatbotId: params.chatbotId,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Text added to knowledge base!");
      setText("");
      queryClient.invalidateQueries({
        queryKey: ["sources", params.chatbotId],
      });
      setIsOpen(false); // Close the dialog after successful mutation
    },
    onError: (err) => {
      toast.error("Error adding text");
      console.error(err);
    },
  });

  const handleSubmit = () => {
    if (text.trim()) {
      mutate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="size-20 sm:size-24 border border-border rounded-lg flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-purple-600">
            <Image
              src={TextIcon}
              alt="Text Icon"
              width={50}
              height={50}
              className="w-6 h-6 sm:w-8 sm:h-8 dark:invert transition-transform duration-300 group-hover:scale-110"
            />
            <span className="mt-2 text-xs sm:text-sm font-medium text-foreground">
              Text
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Text</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Enter your custom text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
          />
          <p className="text-sm text-muted-foreground">
            Enter custom text for the bot to learn from
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!text.trim() || isPending}
          variant="custom"
        >
          {isPending ? "Adding To Knowledge Base..." : "Submit"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
