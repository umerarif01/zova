"use server";

import { signIn } from "@/utils/auth";

export async function signInWithCredentials(formData: FormData) {
  await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: true,
    callbackUrl: "/dashboard",
  });
}

export async function signInWithGoogle() {
  await signIn("google", {
    redirect: true,
    callbackUrl: "/dashboard",
  });
}
