import PageWrapper from "@/components/wrapper/page-wrapper";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { GoogleButton } from "../../_components/google-button";
import { signInWithGoogle } from "@/lib/actions/sign-in";
import { signUpAction } from "@/lib/actions/auth";
import { SubmitButton } from "../../_components/submit-button";

export default function SignUpPage() {
  return (
    <PageWrapper>
      <div className="flex min-w-screen justify-center my-[5rem]">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <form action={signUpAction} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter a password"
                    required
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <SubmitButton>Sign Up</SubmitButton>
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

              <form action={signInWithGoogle}>
                <GoogleButton />
              </form>

              <p className="text-xs text-center text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link href="#" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>
              </p>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-purple-600 hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
