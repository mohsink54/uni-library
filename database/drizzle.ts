import config from "@/lib/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

let dbInstance: ReturnType<typeof drizzle> | null = null;

const getDb = () => {
  if (!config.env.databaseUrl) {
    throw new Error("No database connection string was provided");
  }

  if (!dbInstance) {
    const sql = neon(config.env.databaseUrl);
    dbInstance = drizzle({ client: sql, casing: "snake_case" });
  }

  return dbInstance;
};

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});
