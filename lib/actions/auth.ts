"use server";

import { db } from "@/drizzle/db";
import { users, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/utils/auth";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";
import { ResetPasswordEmail } from "../email/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    email,
    name,
    password: hashedPassword,
    role: "user",
    image: "/user-icon.webp",
    noOfKnowledgeSources: 0,
    noOfChatbots: 0,
    noOfTokens: 0,
  });

  await signIn("credentials", {
    email,
    password,
    redirect: true,
    callbackUrl: "/dashboard",
  });

  redirect("/dashboard");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { error: "User not found" };
  }

  const token = uuidv4();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  await db.insert(verificationTokens).values({
    identifier: user.email!,
    token,
    expires,
  });

  const resetLink = `${process.env.AUTH_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Zova.chat <onboarding@resend.dev>",
    to: [user.email || ""],
    subject: "Reset your password",
    react: ResetPasswordEmail({ resetLink }),
  });

  return { success: "Reset link sent to your email" };
}

export async function resetPasswordAction(token: string, formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const [verificationToken] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token))
    .limit(1);

  if (!verificationToken || verificationToken.expires < new Date()) {
    return { error: "Invalid or expired token" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, verificationToken.identifier));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.token, token));

  return { success: "Password updated successfully" };
}
