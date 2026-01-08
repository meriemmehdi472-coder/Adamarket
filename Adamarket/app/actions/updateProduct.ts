
"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db/drizzle";
import { products } from "@/lib/db/schema";



function normalizePrice(value: string): number {
    return Number(
      value
        .replace(/\s/g, "")   
        .replace(",", ".")  
    );
  }

export const updateProduct = async (formData: FormData) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  // --- productId ---
  const rawId = formData.get("productId");
  const productId = Number(rawId);

  if (!(productId > 0)) {
    redirect("/account?error=invalid_id");
  }

  // --- fields ---
  const title = (formData.get("title")?.toString() ?? "").trim();

  const rawPrice = (formData.get("priceCents")?.toString() ?? "").trim();
  const price = normalizePrice(rawPrice);
  const priceCents = Math.round(price * 100);

  const categoryId = Number(formData.get("categoryId"));

  const descriptionRaw = formData.get("description")?.toString() ?? "";
  const description = descriptionRaw.trim() === "" ? null : descriptionRaw.trim();

  const imageUrlRaw = formData.get("imageUrl")?.toString() ?? "";
  const imageUrl = imageUrlRaw.trim() === "" ? null : imageUrlRaw.trim();

  const isPublished = formData.get("isPublished") === "on";

  // --- validations ---
  if (!title) {
    redirect(`/account/products/${productId}/edit?error=missing_title`);
  }
  if (!Number.isFinite(priceCents) || priceCents <= 0) {
    redirect(`/account/products/${productId}/edit?error=invalid_price`);
  }
  if (!(categoryId > 0)) {
    redirect(`/account/products/${productId}/edit?error=missing_category`);
  }

  // --- update (protected by ownerId) ---
  const updated = await db
    .update(products)
    .set({
      title,
      description,
      priceCents,
      imageUrl,
      categoryId,
      isPublished,
      // Si ton schema a updatedAt, tu peux décommenter :
      // updatedAt: new Date(),
    })
    .where(and(eq(products.id, productId), eq(products.ownerId, session.user.id)))
    .returning({ id: products.id });

  if (updated.length === 0) {
    redirect("/account?error=not_allowed");
  }

  revalidatePath("/account");
  redirect("/account");
};
