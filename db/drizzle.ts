import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
// import { oneAuto } from "@/db/schema";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql);

// export const db = drizzle(sql, {
//   schema: { oneAuto },
// });

// export const db = drizzle(sql, {
//   schema: { oneAuto },
// });
