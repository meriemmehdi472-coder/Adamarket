"use server";

import { db } from "@/lib/db/drizzle";
import { favorites } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function toggleFavorite(productId: number) {
  // 1) Récupérer la session (source de vérité)
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
    // alternative: redirect("/auth/sign-in")
  }

  const userId = session.user.id;

  // 2) Vérifier si le favori existe déjà
  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));

  // 3) Si existe -> delete, sinon -> insert
  if (existing.length > 0) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));

    return { isFavorite: false };
  }

  await db.insert(favorites).values({ userId, productId });

  return { isFavorite: true };
}
