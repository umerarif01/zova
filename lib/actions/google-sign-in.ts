"use server";

import { signIn } from "@/utils/auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}
