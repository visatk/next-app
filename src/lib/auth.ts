import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(getDB(), {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  // This extends the Session User type to include the 'role' field
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user", // Ensure this matches your schema default
      },
    },
  },
  emailAndPassword: { enabled: true },
});
