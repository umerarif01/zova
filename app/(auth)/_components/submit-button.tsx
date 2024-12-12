"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      disabled={pending}
    >
      {pending ? <Loader className="mr-2 w-4 h-4 animate-spin" /> : children}
    </Button>
  );
}
