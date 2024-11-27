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
  { date: "2024-04-01", totalResponses: 342 },
  { date: "2024-04-02", totalResponses: 257 },
  { date: "2024-04-03", totalResponses: 267 },
  { date: "2024-04-04", totalResponses: 482 },
  { date: "2024-04-05", totalResponses: 633 },
  { date: "2024-04-06", totalResponses: 611 },
  { date: "2024-04-07", totalResponses: 405 },
  { date: "2024-04-08", totalResponses: 699 },
  { date: "2024-04-09", totalResponses: 159 },
  { date: "2024-04-10", totalResponses: 431 },
  { date: "2024-04-11", totalResponses: 647 },
  { date: "2024-04-12", totalResponses: 482 },
  { date: "2024-04-13", totalResponses: 692 },
  { date: "2024-04-14", totalResponses: 337 },
  { date: "2024-04-15", totalResponses: 270 },
  { date: "2024-04-16", totalResponses: 308 },
  { date: "2024-04-17", totalResponses: 776 },
  { date: "2024-04-18", totalResponses: 744 },
  { date: "2024-04-19", totalResponses: 403 },
  { date: "2024-04-20", totalResponses: 219 },
  { date: "2024-04-21", totalResponses: 317 },
  { date: "2024-04-22", totalResponses: 374 },
  { date: "2024-04-23", totalResponses: 348 },
  { date: "2024-04-24", totalResponses: 647 },
  { date: "2024-04-25", totalResponses: 445 },
  { date: "2024-04-26", totalResponses: 195 },
  { date: "2024-04-27", totalResponses: 773 },
  { date: "2024-04-28", totalResponses: 282 },
  { date: "2024-04-29", totalResponses: 525 },
  { date: "2024-04-30", totalResponses: 804 },
];

const chartConfig = {
  totalResponses: {
    label: "Total Responses",
    color: "hsl(var(--chart-3))",
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
            <Bar dataKey="totalResponses" fill="var(--color-totalResponses)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
