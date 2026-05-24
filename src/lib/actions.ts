"use server";

import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createQuiz(title: string, description: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  await db.insert(quizzes).values({
    id: crypto.randomUUID(),
    title,
    description,
    creatorId: session.user.id,
    createdAt: new Date(),
  });

  revalidatePath("/admin");
}

export async function getQuizzes(userId: string) {
  return await db.select().from(quizzes).where(eq(quizzes.creatorId, userId));
}
