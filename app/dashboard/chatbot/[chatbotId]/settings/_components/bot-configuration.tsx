"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, SaveIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateChatbot } from "@/drizzle/queries/update";

interface BotConfiguration {
  chatbot: {
    id: string;
    name: string;
    userId: string;
    icon: string | null;
    welcomeMessage: string | null;
    model: string | null;
    background: string | null;
    textColor: string | null;
    createdAt: Date;
  };
}

const BotConfiguration = ({ chatbot }: BotConfiguration) => {
  const [formData, setFormData] = useState({
    id: chatbot.id,
    name: chatbot.name || "",
    userId: chatbot.userId,
    icon: chatbot.icon || null,
    model: chatbot.model || "",
    welcomeMessage:
      chatbot.welcomeMessage || "👋 Hi! How can I help you today?",
    background: chatbot.background || "#a855f7",
    textColor: chatbot.textColor || "#000000",
    createdAt: chatbot.createdAt,
  });

  const updateChatbotMutation = useMutation({
    mutationFn: async () => {
      return await updateChatbot(formData);
    },
    onSuccess: () => {
      toast.success("Chatbot settings updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update chatbot settings");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    updateChatbotMutation.mutate();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chatbot Configuration</CardTitle>
        <CardDescription>
          {`Customize your chatbot's basic settings`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Bot Name
          </label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium">
            Select Model
          </label>
          <Select
            defaultValue={formData.model}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, model: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
              <SelectItem value="claude-3.5-sonnet">
                Claude 3.5 Sonnet
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="welcomeMessage" className="text-sm font-medium">
            Welcome Message
          </label>
          <Input
            id="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="background" className="text-sm font-medium">
            Background Color
          </label>
          <input
            type="color"
            id="background"
            value={formData.background}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="textColor" className="text-sm font-medium">
            Text Color
          </label>
          <input
            type="color"
            id="textColor"
            value={formData.textColor}
            onChange={handleChange}
            className="w-full "
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={"custom"}
          onClick={handleSubmit}
          disabled={updateChatbotMutation.isPending}
        >
          {!updateChatbotMutation.isPending && (
            <SaveIcon className="mr-2 h-4 w-4" />
          )}
          {updateChatbotMutation.isPending ? (
            <Loader className="animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BotConfiguration;
