"use client";

import React from "react";
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
import { RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

const AdvancedActions = () => {
  return (
    <Card className="w-full">
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
  );
};

export default AdvancedActions;
