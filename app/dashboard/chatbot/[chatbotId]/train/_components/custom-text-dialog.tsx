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

export default function CustomTextDialog() {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      // Here you would typically send the text to your server
      console.log("Submitting text:", text);
      // Reset the text state after submission
      setText("");
    }
  };

  return (
    <Dialog>
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
          disabled={!text.trim()}
          variant="custom"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
