"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import { useState } from "react";
import { DeleteSourceDialog } from "./delete-source-dialog";

interface Source {
  id: string;
  name: string;
  type: string;
  sourceUrl: string;
  createdAt: Date;
  userId: string;
  userEmail?: string;
}

interface SourceActionDropdownProps {
  source: Source;
  onView: () => void;
}

export function SourceActionDropdown({
  source,
  onView,
}: SourceActionDropdownProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              onView();
              setOpen(false);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Source
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setShowDeleteDialog(true);
              setOpen(false);
            }}
            className="text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Source
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteSourceDialog
        source={source}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
