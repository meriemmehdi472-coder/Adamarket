// scripts/seed.ts

import "dotenv/config"
import { db } from "@/lib/db/drizzle";
import {  categories, products, comments } from "@/lib/db/schema";
import { users } from "@/lib/db/auth-schema";
import { eq } from "drizzle-orm";
import { role } from "better-auth/client";

// petit helper pour les slugs
const slugify = (s: string) =>
  s.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

async function main() {
  console.log("🌱 Seeding database...\n");

  //
  // 1) USERS (Better Auth)
  //
  const userSeed = [
    {
      id: "user_1",
      name: "Alice Doe",
      email: "alice@example.com",
      emailVerified: true,
      image: null,
      role: "admin",
    },
    {
      id: "user_2",
      name: "Bob Martin",
      email: "bob@example.com",
      emailVerified: true,
      image: null,
      role: "user",
    },
    {
      id: "user_3",
      name: "Charlie Stone",
      email: "charlie@example.com",
      emailVerified: false,
      image: null,
      role: "user",
    },
 
  ];

  await db.insert(users).values(userSeed).onConflictDoNothing();
  console.log("✔ Users inserted");

  //
  // 2) CATEGORIES
  //
  const categorySeed = [
    {
      name: "Informatique",
      slug: "informatique",
      description: "Matériel et accessoires tech",
    },
    {
      name: "Maison",
      slug: "maison",
      description: "Objets pour la maison",
    },
    {
      name: "Sport",
      slug: "sport",
      description: "Équipement sportif",
    },
  ];

  await db.insert(categories).values(categorySeed).onConflictDoNothing();
  console.log("✔ Categories inserted");

  const catRows = await db.select().from(categories);

  const catId = {
    informatique: catRows.find((c) => c.slug === "informatique")?.id!,
    maison: catRows.find((c) => c.slug === "maison")?.id!,
    sport: catRows.find((c) => c.slug === "sport")?.id!,
  };

  //
  // 3) PRODUCTS
  //
  const productSeed = [
    {
      title: "Clavier mécanique RGB",
      slug: slugify("Clavier mécanique RGB"),
      description: "Clavier gaming switch rouges",
      priceCents: 8900,
      isPublished: true,
      imageUrl: null,
      ownerId: "user_1",
      categoryId: catId.informatique,
    },
    {
      title: "Souris sans fil",
      slug: slugify("Souris sans fil"),
      description: "Compacte, 2.4G",
      priceCents: 2900,
      isPublished: true,
      imageUrl: null,
      ownerId: "user_2",
      categoryId: catId.informatique,
    },
    {
      title: "Lampe de table LED",
      slug: slugify("Lampe de table LED"),
      description: "Éclairage doux et moderne",
      priceCents: 3500,
      isPublished: false,
      imageUrl: null,
      ownerId: "user_3",
      categoryId: catId.maison,
    },
    {
      title: "Tapis de course pliable",
      slug: slugify("Tapis de course pliable"),
      description: "Parfait pour le sport à domicile",
      priceCents: 25000,
      isPublished: true,
      imageUrl: null,
      ownerId: "user_1",
      categoryId: catId.sport,
    },
    {
      title: "Gourde isotherme",
      slug: slugify("Gourde isotherme"),
      description: "Garde le froid 12h",
      priceCents: 1900,
      isPublished: true,
      imageUrl: null,
      ownerId: "user_2",
      categoryId: catId.sport,
    },
    {
      title: "Aspirateur sans sac",
      slug: slugify("Aspirateur sans sac"),
      description: "Silencieux, filtration HEPA",
      priceCents: 12000,
      isPublished: false,
      imageUrl: null,
      ownerId: "user_3",
      categoryId: catId.maison,
    },
  ];

  await db.insert(products).values(productSeed).onConflictDoNothing();
  console.log("✔ Products inserted");

  const prodRows = await db.select().from(products);

  //
  // 4) COMMENTS
  //
  const commentSeed = [
    {
      productId: prodRows[0].id,
      authorId: "user_2",
      content: "Super clavier, je recommande !",
    },
    {
      productId: prodRows[0].id,
      authorId: "user_3",
      content: "Joli design mais un peu bruyant.",
    },
    {
      productId: prodRows[1].id,
      authorId: "user_1",
      content: "Bonne souris, batterie correcte.",
    },
    {
      productId: prodRows[3].id,
      authorId: "user_3",
      content: "Très bon tapis pour commencer le sport.",
    },
    {
      productId: prodRows[4].id,
      authorId: "user_1",
      content: "La gourde garde bien le froid.",
    },
    {
      productId: prodRows[2].id,
      authorId: "user_2",
      content: "Parfaite comme lampe de chevet.",
    },
  ];

  await db.insert(comments).values(commentSeed);
  console.log("✔ Comments inserted");

  console.log("\n🌱 SEED COMPLETED");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

//   //export const userNeeds = needs.user({
//   role: true,
//   isBanned: true,
// });