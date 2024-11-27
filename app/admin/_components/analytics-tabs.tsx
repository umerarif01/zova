"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TotalChatsChart } from "./total-chats-chart";
import { TotalTokensChart } from "./total-tokens-chart";
import { TotalResponsesChart } from "@/app/dashboard/_components/total-responses";

export function AnalyticsTabs() {
  return (
    <Tabs
      defaultValue="chats"
      className="w-full col-span-3 border p-3 rounded-md"
    >
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="chats" className="text-xs">
          Total Chats
        </TabsTrigger>
        <TabsTrigger value="tokens" className="text-xs">
          Total Tokens
        </TabsTrigger>
        <TabsTrigger value="responses" className="text-xs">
          Total Responses
        </TabsTrigger>
      </TabsList>
      <TabsContent value="chats">
        <TotalChatsChart />
      </TabsContent>
      <TabsContent value="tokens">
        <TotalTokensChart />
      </TabsContent>
      <TabsContent value="responses">
        <TotalResponsesChart />
      </TabsContent>
    </Tabs>
  );
}
