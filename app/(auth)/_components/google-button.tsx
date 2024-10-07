"use client";

import { GoogleIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";

export function GoogleButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" className="w-full" disabled={pending}>
      {pending ? (
        <Loader className="mr-2 w-4 h-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      Google
    </Button>
  );
}
