import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

/**
 * Lazily initializes the Drizzle ORM connection.
 * Bypasses Next.js static build evaluation by fetching the D1 binding at runtime.
 */
export const getDb = async () => {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB);
};
