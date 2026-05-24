'use server';

import { db } from "@/db";
import { wallets, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth"; // Your better-auth instance
import { headers } from "next/headers";
import { validateTurnstile } from "@/lib/security";
import { randomUUID } from "crypto";

export async function processTransaction(
  amount: number, 
  type: string, 
  turnstileToken: string
) {
  // 1. Auth & Bot Check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const isHuman = await validateTurnstile(turnstileToken);
  if (!isHuman) throw new Error("Security verification failed");

  const idempotencyKey = randomUUID(); // In production, pass this from the client

  // 2. Atomic D1 Transaction
  try {
    await db.transaction(async (tx) => {
      // Get or create wallet
      let userWallet = await tx.select().from(wallets).where(eq(wallets.userId, session.user.id)).get();
      
      if (!userWallet) {
        const newWalletId = randomUUID();
        await tx.insert(wallets).values({ id: newWalletId, userId: session.user.id, balance: 0 });
        userWallet = { id: newWalletId, userId: session.user.id, balance: 0, currency: 'CREDITS', updatedAt: new Date() };
      }

      // Enforce bounds (No negative balance unless allowed)
      if (type === 'withdrawal' && userWallet.balance < Math.abs(amount)) {
        throw new Error("Insufficient funds");
      }

      // Insert Ledger Entry
      await tx.insert(transactions).values({
        id: randomUUID(),
        walletId: userWallet.id,
        amount: amount,
        type: type,
        idempotencyKey: idempotencyKey
      });

      // Update Balance safely using relative SQL increments to avoid race conditions
      await tx.update(wallets)
        .set({ balance: sql`${wallets.balance} + ${amount}` })
        .where(eq(wallets.id, userWallet.id));
    });

    return { success: true, message: "Transaction processed" };
  } catch (error: any) {
    console.error("Wallet transaction failed:", error);
    return { success: false, error: error.message };
  }
}
