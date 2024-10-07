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
import Link from "next/link";
import { signIn } from "@/auth";
import { GoogleButton } from "../../_components/google-button";

export default function SignInPage() {
  return (
    <PageWrapper>
      <div className="flex min-w-screen justify-center my-[5rem]">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your details below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Input type="email" placeholder="Enter your email address" />
                  <Input type="password" placeholder="Enter your password" />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Sign Up
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/dashboard" });
                }}
              >
                <GoogleButton />
              </form>
              <p className="text-xs text-center text-gray-500">
                By clicking continue, you agree to our{" "}
                <Link href="#" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {`Don't have an account?`}{" "}
              <Link href="/sign-up" className="text-purple-600 hover:underline">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
