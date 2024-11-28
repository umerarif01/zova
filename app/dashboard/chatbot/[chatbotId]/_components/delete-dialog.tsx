"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteChat } from "@/drizzle/queries/delete";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  chatId: string;
}

export function DeleteDialog({ chatId }: DeleteDialogProps) {
  async function handleDelete() {
    const result = await deleteChat(chatId);
    if (result.success) {
      toast.success("Conversation deleted successfully");
    } else {
      toast.error("An error occurred! Please try again");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-1 shadow bg-muted">
          <Trash className="w-4 h-4 text-red-600" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            conversation from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-500/80"
          >
            Delete Chat
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
