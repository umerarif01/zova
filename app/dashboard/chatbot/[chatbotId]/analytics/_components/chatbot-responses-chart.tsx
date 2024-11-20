"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getResponsesAnalytics } from "@/utils/analytics/get";

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

const chartConfig = {
  responses: {
    label: "Responses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChatbotResponsesChart({ chatbotId }: { chatbotId: string }) {
  const { data: chartData = [] } = useQuery({
    queryKey: ["chatbot-responses", chatbotId],
    queryFn: () => getResponsesAnalytics(chatbotId),
  });

  const total = React.useMemo(
    () =>
      chartData.reduce(
        (acc: number, curr: { responses: number }) => acc + curr.responses,
        0
      ),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Chatbot Responses</CardTitle>
          <CardDescription>
            Showing total responses for this chatbot
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.responses.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No response data available
          </div>
        ) : (
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
                    nameKey="responses"
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
              <Bar dataKey="responses" fill="#8A2BE2" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
