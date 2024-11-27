import React, { Suspense } from "react";
import { Loader } from "lucide-react";
import UsersTable from "../_components/users-table";
import { SearchBar } from "../_components/search-bar";

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: number;
  };
}) {
  const query = searchParams?.query || "";
  const page = searchParams?.page || undefined;

  return (
    <div className="flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4">
      <h1 className="font-cal text-2xl sm:text-3xl font-bold dark:text-white mb-4 sm:mb-0 border-b-2 pb-2 w-full">
        Users
      </h1>
      <SearchBar placeholder="Search Users" />

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-12 w-full">
            <Loader className="animate-spin" />
          </div>
        }
      >
        <UsersTable query={query} page={page} />
      </Suspense>
    </div>
  );
}
