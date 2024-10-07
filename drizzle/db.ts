import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const client = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(client);
