"use client";

import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardDescription } from "@/components/ui/card";
import { RefreshCw, Trash2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col justify-start items-start px-4 pt-5 gap-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 w-full border-b pb-4">
        <h2 className="mt-6 sm:mt-0 scroll-m-20 text-2xl sm:text-3xl font-semibold tracking-tight transition-colors">
          Chatbot Settings
        </h2>
      </div>
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Bot Configuration</CardTitle>
          <CardDescription>
            {`Customize your chatbot's basic settings`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="botName" className="text-sm font-medium">
              Bot Name
            </label>
            <Input
              id="botName"
              placeholder="Enter bot name"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="modelName" className="text-sm font-medium">
              Select Model
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-mini">GPT-4-mini</SelectItem>
                <SelectItem value="claude-3.5-sonnet">
                  Claude 3.5 Sonnet
                </SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant={"custom"}>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Advanced Actions</CardTitle>
          <CardDescription>
            {`Manage your chatbot's data and existence`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {`Be cautious when using these actions. They can't be undone.`}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full" onClick={() => {}}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Bot
          </Button>
          <Button variant="destructive" className="w-full" onClick={() => {}}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Bot
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
