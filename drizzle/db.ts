import { config } from "dotenv";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env" });

// neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql);
export const db = drizzle(sql);

export * from "drizzle-orm";
