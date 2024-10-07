import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { TotalChatsChart } from "../_components/total-chats-chart";
import { TotalResponsesChart } from "../_components/total-responses";
import { TotalTokensChart } from "../_components/total-tokens-chart";

export default function Analytics() {
  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Analytics
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="lg:col-span-1">
          <TotalChatsChart />
        </div>
        <div className="lg:col-span-1">
          <TotalResponsesChart />
        </div>
        <div className="col-span-1 lg:col-span-2">
          <TotalTokensChart />
        </div>
      </div>
    </div>
  );
}
