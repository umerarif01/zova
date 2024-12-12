"use client";

import { useState } from "react";
import { loginWithGoogle } from "@/lib/actions/auth";
import { GoogleIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function GoogleButton({
  label = "Sign in with Google",
}: {
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    await loginWithGoogle();
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader className="mr-2 w-4 h-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      Google
    </Button>
  );
}
