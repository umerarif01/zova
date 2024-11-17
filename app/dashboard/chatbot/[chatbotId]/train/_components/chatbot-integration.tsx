"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationTab from "./integration-tab";
import PreviewTab from "./preview-tab";

export type ChatbotConfig = {
  botName: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
  isTypingIndicatorOn: boolean;
  isSoundOn: boolean;
};

export default function ChatbotIntegrationPage() {
  const [config, setConfig] = useState<ChatbotConfig>({
    botName: "Chatbot",
    welcomeMessage: "Hello! How can I assist you today?",
    primaryColor: "#007bff",
    secondaryColor: "#e9ecef",
    isTypingIndicatorOn: true,
    isSoundOn: false,
  });

  return (
    <Tabs defaultValue="integration" className="w-full mb-6">
      <TabsList>
        <TabsTrigger value="integration">Integration</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="integration">
        <IntegrationTab config={config} setConfig={setConfig} />
      </TabsContent>
      <TabsContent value="preview">
        <PreviewTab config={config} />
      </TabsContent>
    </Tabs>
  );
}
