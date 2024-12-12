import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
      banned?: boolean; // Added banned attribute
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
    banned?: boolean; // Added banned attribute
  }
}
