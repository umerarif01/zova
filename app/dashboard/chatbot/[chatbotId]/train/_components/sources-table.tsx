"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { DataTableWithFeatures } from "./data-table-with-features";
import { columns } from "./columns";
import { KBSource } from "@/types/kb-source";
import { Query } from "@tanstack/react-query";

export function SourcesTable() {
  const params = useParams();

  const { data, isLoading } = useQuery<{ sources: KBSource[] }>({
    queryKey: ["sources", params.chatbotId],
    queryFn: async () => {
      const response = await axios.get<{ sources: KBSource[] }>(
        `/api/sources?chatbotId=${params.chatbotId}`
      );
      return response.data;
    },
    refetchInterval: (query) => {
      const data = query.state.data as { sources: KBSource[] } | undefined;
      if (!data) return false;
      return data.sources.some((source) => source.status === "processing")
        ? 5000
        : false;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return <DataTableWithFeatures columns={columns} data={data?.sources || []} />;
}
