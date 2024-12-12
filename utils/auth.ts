import NextAuth from "next-auth";
import { db, eq } from "@/drizzle/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  verificationTokens,
  users,
} from "@/drizzle/schema";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "@/lib/validations/auth";
// import { saltAndHashPassword, verifyPassword } from "@/lib/utils/auth-utils";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize: async (credentials) => {
      //   try {
      //     const { email, password } = credentials as {
      //       email: string;
      //       password: string;
      //     };

      //     if (!email || !password) {
      //       return null;
      //     }

      //     const [user] = await db
      //       .select()
      //       .from(users)
      //       .where(eq(users.email, email))
      //       .limit(1);

      //     if (!user || !user.password) {
      //       return null;
      //     }

      //     const isValid = await verifyPassword(password, user.password);

      //     if (!isValid) {
      //       return null;
      //     }

      //     return {
      //       id: user.id,
      //       name: user.name,
      //       email: user.email,
      //       image: user.image,
      //       role: user.role || undefined,
      //       banned: user.banned,
      //     };
      //   } catch (error) {
      //     return null;
      //   }
      // },
    }),
    Google({
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "user",
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ["/dashboard", "/chat", "/admin"];
      const isProtected = paths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("api/auth/signin", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      session.user.banned = user.banned;
      return session;
    },
  },
});
