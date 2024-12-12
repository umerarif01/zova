"use client";

import { forgotPasswordAction } from "@/lib/actions/auth";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(
    async (prevState: any, formData: FormData) => {
      return forgotPasswordAction(formData);
    },
    null
  );

  if (state?.error) {
    toast.error(state.error);
  }

  if (state?.success) {
    toast.success(state.success);
  }

  return (
    <PageWrapper>
      <div className="flex min-w-screen justify-center my-[5rem]">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Forgot your password?
            </CardTitle>
            <CardDescription>
              {`Enter your email and we'll send you a reset link`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <Input
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
              />
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Send Reset Link
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link href="/sign-in" className="text-purple-600 hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
