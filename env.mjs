import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
    REACT_APP_GOOGLE_MAPS_API_KEY: z.string().min(1),
    NODE_ENV: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_APP_API_URL: z.string().min(1),
    FLASK_API_PORT: z.string().default("5000"), // Default to '5000' if not set
    PORT: z.string().default("3000"), // Default to '3000' if not set
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_APP_API_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_API_URL: process.env.NEXT_PUBLIC_APP_API_URL,
    DOMAIN: process.env.DOMAIN,
    REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    NODE_ENV: process.env.NODE_ENV || "development",
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    PORT: process.env.PORT || "3000",
    FLASK_API_PORT: process.env.FLASK_API_PORT || "5000",
  },
});
