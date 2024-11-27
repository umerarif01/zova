import React, { Suspense } from "react";
import { Loader, DollarSign, BotIcon, User2 } from "lucide-react";
import { SearchBar } from "./_components/search-bar";
import AnalayticCard from "./_components/analytics-card";
import { AnalyticsTabs } from "./_components/analytics-tabs";
import RecentSubscriptions from "./_components/recent-subscriptions";

export default async function AdminPage() {
  return (
    <div className="flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4 ">
      <h1 className="font-cal text-2xl sm:text-3xl font-bold dark:text-white mb-4 sm:mb-0 border-b-2 pb-2 w-full">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
        <AnalayticCard
          title="Active Subscriptions"
          value={2}
          icon={DollarSign}
        />
        <AnalayticCard title="Total Users" value={5} icon={User2} />
        <AnalayticCard
          title="Total Knowledge Sources"
          value={5}
          icon={DollarSign}
        />
        <AnalayticCard title="Total Chatbots" value={1} icon={BotIcon} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
        <AnalyticsTabs />
        <RecentSubscriptions />
      </div>
    </div>
  );
}
