import React, { Suspense } from "react";
import { Loader, DollarSign, BotIcon, Users2, Brain } from "lucide-react";
import { SearchBar } from "./_components/search-bar";
import AnalayticCard from "./_components/analytics-card";
import { AnalyticsTabs } from "./_components/analytics-tabs";
import RecentSubscriptions from "./_components/recent-subscriptions";
import { getAdminDashboardStats, getAnalytics } from "@/drizzle/queries/admin";

// Loading component for analytics cards
function AnalyticsCardsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 rounded-lg bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

export default async function AdminPage() {
  const [stats, analytics] = await Promise.all([
    getAdminDashboardStats(),
    getAnalytics(),
  ]);

  return (
    <div className="flex flex-col justify-center items-start flex-wrap px-4 pt-4 gap-4">
      <h1 className="font-cal text-2xl sm:text-3xl font-bold dark:text-white mb-4 sm:mb-0 border-b-2 pb-2 w-full">
        Dashboard
      </h1>

      <Suspense fallback={<AnalyticsCardsLoading />}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
          <AnalayticCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions}
            icon={DollarSign}
          />
          <AnalayticCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users2}
          />
          <AnalayticCard
            title="Total Knowledge Sources"
            value={stats.totalKnowledgeSources}
            icon={Brain}
          />
          <AnalayticCard
            title="Total Chatbots"
            value={stats.totalChatbots}
            icon={BotIcon}
          />
        </div>
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
        <Suspense
          fallback={
            <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
          }
        >
          <AnalyticsTabs analytics={analytics} />
        </Suspense>
        <Suspense
          fallback={
            <div className="h-96 bg-gray-100 animate-pulse rounded-lg md:col-span-3" />
          }
        >
          <RecentSubscriptions />
        </Suspense>
      </div>
    </div>
  );
}
