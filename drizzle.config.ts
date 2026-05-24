import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts", // আপনার স্কিমা ফাইলের পাথ
  out: "./drizzle",            // মাইগ্রেশন ফাইল যেখানে জমা হবে
  dialect: "sqlite",           // Cloudflare D1 মূলত SQLite সাপোর্ট করে
});
