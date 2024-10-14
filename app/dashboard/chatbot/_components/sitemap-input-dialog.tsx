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
import Image from "next/image";
import SitemapIcon from "@/public/sitemap.png";
import { LinkIcon } from "lucide-react";

export default function SitemapInputDialog() {
  const [sitemapUrl, setSitemapUrl] = useState("");

  const handleSubmit = () => {
    if (sitemapUrl.trim()) {
      // Here you would typically send the sitemap URL to your server
      console.log("Submitting sitemap URL:", sitemapUrl);
      // Reset the sitemap URL state after submission
      setSitemapUrl("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer group">
          <div className="size-20 sm:size-24 border border-border rounded-lg flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:border-purple-600">
            <Image
              src={SitemapIcon}
              alt="Sitemap Icon"
              width={50}
              height={50}
              className="w-6 h-6 sm:w-8 sm:h-8 dark:invert transition-transform duration-300 group-hover:scale-110"
            />
            <span className="mt-2 text-xs sm:text-sm font-medium text-foreground">
              Sitemap
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Sitemap URL</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Input
              type="url"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="Enter sitemap URL"
              className="flex-grow"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Enter sitemap url to crawl
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={!sitemapUrl.trim()}
          variant="custom"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
}
