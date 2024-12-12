"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { deleteSource } from "@/drizzle/queries/admin";
import { toast } from "sonner";

interface DeleteSourceDialogProps {
  source: {
    id: string;
    name: string;
    userId: string;
    userEmail?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSourceDialog({
  source,
  open,
  onOpenChange,
}: DeleteSourceDialogProps) {
  const [sendEmail, setSendEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!source) return null;

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteSource(source.id, sendEmail);
      toast.success("Source deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete source");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Source</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{source.name}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sendEmail"
            checked={sendEmail}
            onCheckedChange={(checked) => setSendEmail(checked as boolean)}
          />
          <label
            htmlFor="sendEmail"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Notify user via email
          </label>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
