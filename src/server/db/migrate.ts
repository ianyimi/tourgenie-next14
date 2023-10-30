import "dotenv/config";

import { Pool } from "pg";
import { env } from "~/env.mjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const pool = new Pool({
  connectionString: env.DATABASE_CONNECTION_STRING,
  max: 1,
});

export const db = drizzle(pool);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "src/server/db/migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

void main();
