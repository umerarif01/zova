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

export const description = "A bar chart showing total responses";

const chartData = [
  { date: "2024-04-01", totalResponses: 372 },
  { date: "2024-04-02", totalResponses: 277 },
  { date: "2024-04-03", totalResponses: 287 },
  { date: "2024-04-04", totalResponses: 502 },
  { date: "2024-04-05", totalResponses: 663 },
  { date: "2024-04-06", totalResponses: 641 },
  { date: "2024-04-07", totalResponses: 425 },
  { date: "2024-04-08", totalResponses: 729 },
  { date: "2024-04-09", totalResponses: 169 },
  { date: "2024-04-10", totalResponses: 451 },
  { date: "2024-04-11", totalResponses: 677 },
  { date: "2024-04-12", totalResponses: 502 },
  { date: "2024-04-13", totalResponses: 722 },
  { date: "2024-04-14", totalResponses: 357 },
  { date: "2024-04-15", totalResponses: 290 },
  { date: "2024-04-16", totalResponses: 328 },
  { date: "2024-04-17", totalResponses: 806 },
  { date: "2024-04-18", totalResponses: 774 },
  { date: "2024-04-19", totalResponses: 423 },
  { date: "2024-04-20", totalResponses: 239 },
  { date: "2024-04-21", totalResponses: 337 },
  { date: "2024-04-22", totalResponses: 394 },
  { date: "2024-04-23", totalResponses: 368 },
  { date: "2024-04-24", totalResponses: 677 },
  { date: "2024-04-25", totalResponses: 465 },
  { date: "2024-04-26", totalResponses: 205 },
  { date: "2024-04-27", totalResponses: 803 },
  { date: "2024-04-28", totalResponses: 302 },
  { date: "2024-04-29", totalResponses: 555 },
  { date: "2024-04-30", totalResponses: 834 },
];

const chartConfig = {
  totalResponses: {
    label: "Total Responses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TotalResponsesChart() {
  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.totalResponses, 0),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Responses</CardTitle>
          <CardDescription>
            Showing total responses from all chatbots in the last 30 days
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.totalResponses.label}
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
                  nameKey="totalResponses"
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
            <Bar dataKey="totalResponses" fill="#8A2BE2" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
