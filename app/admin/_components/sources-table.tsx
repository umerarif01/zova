"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ViewSourceDialog } from "./view-source-dialog";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SourcesSearchBar } from "./sources-search-bar";
import { Badge } from "@/components/ui/badge";
import { SourceActionDropdown } from "./source-action-dropdown";

interface Source {
  id: string;
  name: string;
  type: string;
  sourceUrl: string;
  createdAt: Date;
  userId: string;
  userEmail?: string;
}

interface SourcesTableProps {
  sources: Source[];
  totalPages: number;
  currentPage: number;
}

export default function SourcesTable({
  sources,
  totalPages,
  currentPage,
}: SourcesTableProps) {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between">
        <SourcesSearchBar placeholder="Search sources..." />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sources.map((source) => (
            <TableRow key={source.id}>
              <TableCell>{source.name}</TableCell>
              <TableCell>
                <Badge className="uppercase">{source.type}</Badge>
              </TableCell>
              <TableCell>
                {new Date(source.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <SourceActionDropdown
                  source={source}
                  onView={() => setSelectedSource(source)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-x-6 lg:gap-x-8">
          <div className="flex items-center gap-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => replace(createPageURL(1))}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => replace(createPageURL(currentPage - 1))}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-x-2">
              <div className="text-sm font-medium">Page {currentPage}</div>
              <div className="text-sm font-medium">of {totalPages}</div>
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => replace(createPageURL(currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => replace(createPageURL(totalPages))}
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <ViewSourceDialog
        source={selectedSource}
        open={!!selectedSource}
        onOpenChange={(open: any) => !open && setSelectedSource(null)}
      />
    </div>
  );
}
