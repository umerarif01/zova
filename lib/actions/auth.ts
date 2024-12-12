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
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";
import { LoginSchema, RegisterSchema } from "../validations/auth";
import { z } from "zod";
import { hash } from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function getUserFromDb(email: string, password: string) {
  try {
    const existedUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existedUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    if (!existedUser[0].password) {
      return {
        success: false,
        message: "Password is required.",
      };
    }

    const isPasswordMatches = await bcryptjs.compare(
      password,
      existedUser[0].password
    );

    if (!isPasswordMatches) {
      return {
        success: false,
        message: "Password is incorrect.",
      };
    }

    return {
      success: true,
      data: existedUser[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    LoginSchema.parse({
      email,
      password,
    });

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return {
      success: true,
      data: res,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Email or password is incorrect.",
    };
  }
}

export async function register({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    RegisterSchema.parse({
      name,
      email,
      password,
      confirmPassword,
    });
    // get user from db
    const existedUser = await getUserFromDb(email, password);
    if (existedUser.success) {
      return {
        success: false,
        message: "User already exists.",
      };
    }
    const hash = await bcryptjs.hash(password, 10);

    const [insertedUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hash,
        image: "/user-icon.webp",
        role: "user",
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
      });

    return {
      success: true,
      data: insertedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function loginWithGoogle() {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
}
