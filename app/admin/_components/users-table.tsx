import React from "react";
import { DrizzleUser, users } from "@/drizzle/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogTrigger } from "@/components/ui/dialog";
import { getTotalUserCount, selectAllUsers } from "@/drizzle/queries/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const UsersTable = async ({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}) => {
  const pageSize = 10;
  const users: DrizzleUser[] = await selectAllUsers(page, pageSize, query);
  const totalUsers = await getTotalUserCount(query);

  // Calculate pagination details
  const totalPages = Math.ceil(totalUsers / pageSize);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  // Generate pagination links
  const pageNumber = Number(page); // Ensure page is a number

  const prevPage = hasPrevious ? pageNumber - 1 : null;
  const nextPage = hasNext ? pageNumber + 1 : null;

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center w-full mt-4">
        <Pagination>
          <PaginationContent>
            {hasPrevious && (
              <PaginationItem>
                <PaginationPrevious href={`?page=${prevPage}&query=${query}`} />
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={`?page=${pageNumber}&query=${query}`}
                    isActive={pageNumber == page}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            {hasNext && (
              <PaginationItem>
                <PaginationNext href={`?page=${nextPage}&query=${query}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default UsersTable;
