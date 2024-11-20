"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { KBSource } from "@/types/kb-source";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { deleteSource as deleteSourceAction } from "@/utils/actions/data-sources";

export const columns: ColumnDef<KBSource>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className="inline-block border rounded px-2 py-1 text-center text-xs font-medium">
          {type.toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Source Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as KBSource["status"];
      const getBgColor = () => {
        switch (status) {
          case "failed":
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 hover:text-red-900";
          case "completed":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 hover:text-green-900";
          case "processing":
            return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 hover:text-purple-900";
          default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 hover:bg-gray-200 hover:text-gray-900";
        }
      };

      return (
        <Badge
          className={`
            ${getBgColor()}
            ${status === "processing" ? "animate-pulse" : ""}
          `}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const source = row.original;
      const queryClient = useQueryClient();

      const { mutate: resyncSource, isPending: isResyncing } = useMutation({
        mutationFn: async () => {
          const response = await axios.post(`/api/sources/${source.id}/resync`);
          return response.data;
        },
        onSuccess: () => {
          toast.success("Resync started");
          queryClient.invalidateQueries({ queryKey: ["sources"] });
        },
        onError: () => {
          toast.error("Failed to resync source");
        },
      });

      const { mutate: deleteSource, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
          const sourceId = source.id;

          if (!sourceId) {
            throw new Error("Source ID is required");
          }

          return await deleteSourceAction(sourceId);
        },
        onSuccess: () => {
          toast.success("Source deleted");
          queryClient.invalidateQueries({ queryKey: ["sources"] });
        },
        onError: () => {
          toast.error("Failed to delete source");
        },
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => resyncSource()}
              disabled={isResyncing || source.status === "processing"}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isResyncing ? "animate-spin" : ""}`}
              />
              {isResyncing ? "Resyncing..." : "Resync source"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this source?")
                ) {
                  deleteSource();
                }
              }}
              disabled={isDeleting}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete source"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
