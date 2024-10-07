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

export const description = "A bar chart showing total tokens";

const chartData = [
  { date: "2024-04-01", totalTokens: 3720 },
  { date: "2024-04-02", totalTokens: 2770 },
  { date: "2024-04-03", totalTokens: 2870 },
  { date: "2024-04-04", totalTokens: 5020 },
  { date: "2024-04-05", totalTokens: 6630 },
  { date: "2024-04-06", totalTokens: 6410 },
  { date: "2024-04-07", totalTokens: 4250 },
  { date: "2024-04-08", totalTokens: 7290 },
  { date: "2024-04-09", totalTokens: 1690 },
  { date: "2024-04-10", totalTokens: 4510 },
  { date: "2024-04-11", totalTokens: 6770 },
  { date: "2024-04-12", totalTokens: 5020 },
  { date: "2024-04-13", totalTokens: 7220 },
  { date: "2024-04-14", totalTokens: 3570 },
  { date: "2024-04-15", totalTokens: 2900 },
  { date: "2024-04-16", totalTokens: 3280 },
  { date: "2024-04-17", totalTokens: 8060 },
  { date: "2024-04-18", totalTokens: 7740 },
  { date: "2024-04-19", totalTokens: 4230 },
  { date: "2024-04-20", totalTokens: 2390 },
  { date: "2024-04-21", totalTokens: 3370 },
  { date: "2024-04-22", totalTokens: 3940 },
  { date: "2024-04-23", totalTokens: 3680 },
  { date: "2024-04-24", totalTokens: 6770 },
  { date: "2024-04-25", totalTokens: 4650 },
  { date: "2024-04-26", totalTokens: 2050 },
  { date: "2024-04-27", totalTokens: 8030 },
  { date: "2024-04-28", totalTokens: 3020 },
  { date: "2024-04-29", totalTokens: 5550 },
  { date: "2024-04-30", totalTokens: 8340 },
];

const chartConfig = {
  totalTokens: {
    label: "Total Tokens",
    color: "hsl(var(--chart-1))",
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
            Showing total tokens used by all chatbots in the last 30 days
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
            <Bar dataKey="totalTokens" fill="#8A2BE2" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
