import SourcesTable from "../../_components/sources-table";
import { getKnowledgeSources } from "@/drizzle/queries/admin";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
  searchParams: Promise<{
    query?: string;
    userName?: string;
    page?: string;
  }>;
}

export default async function UserKnowledgeSourcesPage({
  params,
  searchParams,
}: PageProps) {
  const { userId } = await params;
  const { query = "", userName = "", page: pageStr = "1" } = await searchParams;

  const page = Number(pageStr) || 1;
  const pageSize = 10;

  const { sources, totalSources } = await getKnowledgeSources(
    userId,
    query.toString(),
    page,
    pageSize
  );

  const totalPages = Math.ceil(totalSources / pageSize);

  return (
    <div className="flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4">
      <h1 className="font-cal text-2xl sm:text-3xl font-bold dark:text-white mb-4 sm:mb-0 border-b-2 pb-2 w-full">
        {`View ${userName}'s Knowledge Sources`}
      </h1>

      <div className="w-full">
        <SourcesTable
          sources={sources}
          totalPages={totalPages}
          currentPage={page}
        />
      </div>
    </div>
  );
}
