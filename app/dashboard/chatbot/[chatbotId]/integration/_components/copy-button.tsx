"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  embedCode: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ embedCode }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    toast("Embed code copied to clipboard");
  };

  return (
    <Button className="mt-2" onClick={handleCopy} variant={"custom"}>
      <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
    </Button>
  );
};

export default CopyButton;
