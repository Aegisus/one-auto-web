import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm/expressions";
import { config } from "dotenv";
import { oneAuto } from "./schema";

// Load environment variables from .env file
config();

// Log the DATABASE_URL value
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be a Neon postgres connection string");
}

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {
  schema: { oneAuto },
});

// Define the table schema
// export const oneAuto = pgTable("one_auto", {
//   id: serial("id").primaryKey(),
//   name: text("name"),
//   // Add other columns as needed
// });

// const sql = neon(
//   "postgresql://neondb_owner:8zZNcm9KrEhq@ep-white-bread-a1qvj6j2.ap-southeast-1.aws.neon.tech/neondb?sslmode=requir"
// );

// Example function to fetch data
// export async function fetchData() {
//   const query = db.select().from(oneAuto).where(eq(oneAuto.id, 8));
//   const result = await query;
//   console.log(result);
//   return result;
// }
