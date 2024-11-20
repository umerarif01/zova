"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getTokenAnalytics } from "@/utils/analytics/get";

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
  tokens: {
    label: "Tokens",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ChatbotTokensChart({ chatbotId }: { chatbotId: string }) {
  const { data: chartData = [] } = useQuery({
    queryKey: ["chatbot-tokens", chatbotId],
    queryFn: () => getTokenAnalytics(chatbotId),
  });

  const total = React.useMemo(
    () =>
      chartData.reduce(
        (acc: number, curr: { tokens: number }) => acc + curr.tokens,
        0
      ),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Chatbot Tokens</CardTitle>
          <CardDescription>
            Showing total tokens used by this chatbot
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.tokens.label}
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
            No token data available
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
                    nameKey="tokens"
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
              <Bar dataKey="tokens" fill="#8A2BE2" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
