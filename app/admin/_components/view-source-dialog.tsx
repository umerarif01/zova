"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContentViewer from "@/app/chat/[chatbotId]/[chatId]/_components/content-viewer";

interface Source {
  id: string;
  name: string;
  type: string;
  sourceUrl: string;
  createdAt: Date;
}

interface ViewSourceDialogProps {
  source: Source | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewSourceDialog({
  source,
  open,
  onOpenChange,
}: ViewSourceDialogProps) {
  if (!source) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[95vh]">
        <DialogHeader>
          <DialogTitle>{source.name}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 -mx-6">
          <ContentViewer
            source={{
              type: source.type,
              sourceUrl: source.sourceUrl,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
