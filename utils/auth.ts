import NextAuth from "next-auth";
import { db } from "@/drizzle/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  verificationTokens,
  users,
} from "@/drizzle/schema";
import Google from "next-auth/providers/google";

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
  providers: [Google],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const paths = ["/dashboard", "/chat"];
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
      return session;
    },
  },
});
