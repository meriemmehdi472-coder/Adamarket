// lib/db/schema.ts

import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  varchar,
  integer,
  primaryKey,
  
} from "drizzle-orm/pg-core";

import { users } from "../db/auth-schema";
import {eq} from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "./drizzle";
import { auth } from "@/lib/auth";




//
// categories
//


export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull().unique(),

  slug: varchar("slug", { length: 120 }).notNull().unique(),

  description: text("description"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

//
// products
//
export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 150 }).notNull(),

  slug: varchar("slug", { length: 160 }).notNull().unique(),

  description: text("description"),

  priceCents: integer("price_cents").notNull(),

  imageUrl: text("image_url"),

  isPublished: boolean("is_published").notNull().default(false),

  ownerId: text("owner_id").notNull(), // Better Auth userId

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

//
// comments
//
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),

  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  authorId: text("author_id").notNull(), // Better Auth userId

  content: text("content").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true }),

  isDeleted: boolean("is_deleted").notNull().default(false),
});


export const favorites = pgTable("favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.productId] }),
  })
);





