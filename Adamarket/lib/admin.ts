// lib/admin.ts
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "./db/drizzle";
import { users } from "./db/auth-schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const headList = await headers(); 
  const session = await auth.api.getSession({
    headers: headList, 
  });

  if (!session?.user?.id) {
    redirect("/sign-in"); 
  }
  // On cherche l'utilisateur
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);

  if (!user) throw new Error("Utilisateur introuvable");
  if (user.isBanned) throw new Error("Compte banni");
  if (user.role !== "admin") throw new Error("Accès admin refusé");

  return user;
}