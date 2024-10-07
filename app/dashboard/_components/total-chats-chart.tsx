"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart showing total chats";

const chartData = [
  { date: "2024-04-01", totalChats: 372 },
  { date: "2024-04-02", totalChats: 277 },
  { date: "2024-04-03", totalChats: 287 },
  { date: "2024-04-04", totalChats: 502 },
  { date: "2024-04-05", totalChats: 663 },
  { date: "2024-04-06", totalChats: 641 },
  { date: "2024-04-07", totalChats: 425 },
  { date: "2024-04-08", totalChats: 729 },
  { date: "2024-04-09", totalChats: 169 },
  { date: "2024-04-10", totalChats: 451 },
  { date: "2024-04-11", totalChats: 677 },
  { date: "2024-04-12", totalChats: 502 },
  { date: "2024-04-13", totalChats: 722 },
  { date: "2024-04-14", totalChats: 357 },
  { date: "2024-04-15", totalChats: 290 },
  { date: "2024-04-16", totalChats: 328 },
  { date: "2024-04-17", totalChats: 806 },
  { date: "2024-04-18", totalChats: 774 },
  { date: "2024-04-19", totalChats: 423 },
  { date: "2024-04-20", totalChats: 239 },
  { date: "2024-04-21", totalChats: 337 },
  { date: "2024-04-22", totalChats: 394 },
  { date: "2024-04-23", totalChats: 368 },
  { date: "2024-04-24", totalChats: 677 },
  { date: "2024-04-25", totalChats: 465 },
  { date: "2024-04-26", totalChats: 205 },
  { date: "2024-04-27", totalChats: 803 },
  { date: "2024-04-28", totalChats: 302 },
  { date: "2024-04-29", totalChats: 555 },
  { date: "2024-04-30", totalChats: 834 },
];

const chartConfig = {
  totalChats: {
    label: "Total Chats",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TotalChatsChart() {
  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.totalChats, 0),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Chats</CardTitle>
          <CardDescription>
            Showing total chats from all chatbots in the last 30 days
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.totalChats.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="totalChats"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="totalChats" fill="#8A2BE2" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
