import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// --- Better Auth Required Tables ---
export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  userId: text("userId").notNull().references(() => users.id),
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

// --- QuizMint Specific Tables ---
export const quizzes = sqliteTable("quiz", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  creatorId: text("creatorId").notNull().references(() => users.id),
  isPublished: integer("isPublished", { mode: "boolean" }).default(false),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const questions = sqliteTable("question", {
  id: text("id").primaryKey(),
  quizId: text("quizId").notNull().references(() => quizzes.id),
  text: text("text").notNull(),
  options: text("options", { mode: "json" }).notNull(), // JSON string array
  correctAnswer: text("correctAnswer").notNull(),
});

export const wallets = sqliteTable("wallet", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  balance: integer("balance").notNull().default(0), // Stored in smallest unit (e.g., cents)
  currency: text("currency").notNull().default("CREDITS"),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`(strftime('%s', 'now'))`)
    .$onUpdate(() => new Date()),
});

export const transactions = sqliteTable("transaction", {
  id: text("id").primaryKey(),
  walletId: text("wallet_id").notNull().references(() => wallets.id),
  amount: integer("amount").notNull(), // Positive for deposit, negative for withdrawal
  type: text("type").notNull(), // 'deposit', 'withdrawal', 'reward', 'purchase'
  status: text("status").notNull().default("completed"), // 'pending', 'completed', 'failed'
  idempotencyKey: text("idempotency_key").unique().notNull(), // Prevent double-billing
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const withdrawals = sqliteTable("withdrawal", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
