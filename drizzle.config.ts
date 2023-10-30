import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  out: "./src/server/db/migrations",
  dbCredentials: {
    connectionString: env.DATABASE_CONNECTION_STRING,
  },
} satisfies Config;
