import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:8zZNcm9KrEhq@ep-white-bread-a1qvj6j2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
  verbose: true,
  strict: true,
  schemaFilter: ["public", "one_auto"],
});
