import { drizzle } from 'drizzle-orm/d1';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDB() {
  if (dbInstance) return dbInstance;
  const { env } = getCloudflareContext();
  dbInstance = drizzle(env.DB, { schema });
  return dbInstance;
}
