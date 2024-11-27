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

const chartData = [
  { date: "2024-04-01", totalTokens: 15372 },
  { date: "2024-04-02", totalTokens: 12277 },
  { date: "2024-04-03", totalTokens: 13287 },
  { date: "2024-04-04", totalTokens: 18502 },
  { date: "2024-04-05", totalTokens: 20663 },
  { date: "2024-04-06", totalTokens: 19641 },
  { date: "2024-04-07", totalTokens: 17425 },
  { date: "2024-04-08", totalTokens: 21729 },
  { date: "2024-04-09", totalTokens: 11169 },
  { date: "2024-04-10", totalTokens: 16451 },
  { date: "2024-04-11", totalTokens: 19677 },
  { date: "2024-04-12", totalTokens: 18502 },
  { date: "2024-04-13", totalTokens: 20722 },
  { date: "2024-04-14", totalTokens: 14357 },
  { date: "2024-04-15", totalTokens: 13290 },
  { date: "2024-04-16", totalTokens: 14328 },
  { date: "2024-04-17", totalTokens: 22806 },
  { date: "2024-04-18", totalTokens: 21774 },
  { date: "2024-04-19", totalTokens: 17423 },
  { date: "2024-04-20", totalTokens: 12239 },
  { date: "2024-04-21", totalTokens: 14337 },
  { date: "2024-04-22", totalTokens: 15394 },
  { date: "2024-04-23", totalTokens: 14368 },
  { date: "2024-04-24", totalTokens: 19677 },
  { date: "2024-04-25", totalTokens: 17465 },
  { date: "2024-04-26", totalTokens: 12205 },
  { date: "2024-04-27", totalTokens: 22803 },
  { date: "2024-04-28", totalTokens: 14302 },
  { date: "2024-04-29", totalTokens: 18555 },
  { date: "2024-04-30", totalTokens: 22834 },
];

const chartConfig = {
  totalTokens: {
    label: "Total Tokens",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TotalTokensChart() {
  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.totalTokens, 0),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Tokens</CardTitle>
          <CardDescription>
            Showing total tokens used from all chatbots in the last 30 days
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.totalTokens.label}
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
                  nameKey="totalTokens"
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
            <Bar dataKey="totalTokens" fill="var(--color-totalTokens)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
