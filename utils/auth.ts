import NextAuth, { User, type NextAuthConfig } from "next-auth";
import { db } from "@/drizzle/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  verificationTokens,
  users,
} from "@/drizzle/schema";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";
import { getUserFromDb } from "@/lib/actions/auth";
import { createSession } from "@/drizzle/queries/insert";

const authConfig: NextAuthConfig = {
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
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const res = await getUserFromDb(email as string, password as string);
        if (res.success) {
          return res.data as User;
        }

        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
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
      if (user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.banned = user.banned;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      if (user) {
        token.role = user.role;
        token.banned = user.banned;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const session = await createSession({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        if (!session) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
