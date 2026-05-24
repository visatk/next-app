import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// 1. Users Table (Enhanced for Admin & Wallet)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(), // Role based Auth
  walletBalance: real("wallet_balance").default(0).notNull(), 
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// 2. Quizzes Table (With Indexes for fast category search)
export const quizzes = sqliteTable("quizzes", {
  id: text("id").primaryKey(),
  question: text("question").notNull(),
  options: text("options", { mode: "json" }).notNull(),
  correctAnswer: text("correct_answer").notNull(),
  category: text("category").notNull(),
  points: integer("points").default(10).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true), // Admin can disable quizzes
}, (table) => ({
  categoryIdx: index("category_idx").on(table.category), // Indexing for faster query
}));

// 3. Withdrawals Table (For Payment Requests)
export const withdrawals = sqliteTable("withdrawals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign Key Constraint
  amount: real("amount").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status), // Indexing for Admin Dashboard filters
}));

// --- RELATIONS V2 ---
// These relations allow Drizzle to automatically fetch nested data efficiently.
export const usersRelations = relations(users, ({ many }) => ({
  withdrawals: many(withdrawals),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  user: one(users, {
    fields: [withdrawals.userId],
    references: [users.id],
  }),
}));
