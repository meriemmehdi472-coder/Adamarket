"use server";

import { db } from "@/lib/db/drizzle";
import { products } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

function slugify(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

 function normalizePrice(value: string): number {
  return Number(
    value
      .replace(/\s/g, "")   
      .replace(",", ".")  
  );
}


export const createProduct = async (formData: FormData) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/auth/signin");

  const title = (formData.get("title") as string)?.trim();

  //const priceCents = Number(formData.get("priceCents"));
  const rawPrice = formData.get("priceCents") as string;
  const price = normalizePrice(rawPrice);
  const priceCents = Math.round(price * 100);


  const categoryId = Number(formData.get("categoryId"));

  const description = (formData.get("description") as string) || null;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const isPublished = formData.get("isPublished") === "on";




  if (!title || !priceCents || !categoryId) {
    throw new Error("Champs requis manquants");
  }

  let slug = slugify(title);
  if (!slug) slug = `product-${Date.now()}`;

  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    slug = `${slug}-${Date.now()}`;
  }

  await db.insert(products).values({
    title,
    slug,
    description,
    priceCents,
    imageUrl,
    isPublished,
    ownerId: session.user.id,
    categoryId,
  });

  redirect("/account");
};
