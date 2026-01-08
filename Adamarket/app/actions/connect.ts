"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import * as authSchema from "@/lib/db/auth-schema";
import { z } from "zod";

/* ---------- TYPES ---------- */

export type AuthState = {
  ok: boolean;
  error?: string;
  role?: string;
};

/* ---------- ZOD ---------- */

const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .trim(),
  email: z.string().email("Email invalide").trim(),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

/* ---------- SIGNUP ---------- */

export const signup = async (
  _prev: AuthState | null,
  formData: FormData
): Promise<AuthState> => {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = signupSchema.safeParse(raw);

  if (!result.success) {
    return { ok: false, error: result.error.issues[0].message };
  }

  const { name, email, password } = result.data;

  try {
    // IMPORTANT: on enlève asResponse:true pour laisser Better Auth gérer la session
    await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });

    return { ok: true };
  } catch (e: any) {
    return {
      ok: false,
      error: e?.message || "Erreur lors de l’inscription",
    };
  }
};

/* ---------- SIGNIN ---------- */

export const signin = async (
  _prev: AuthState | null,
  formData: FormData
): Promise<AuthState> => {
  const email = (formData.get("email") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return { ok: false, error: "Email et mot de passe requis." };
  }

  const user = await db.query.users.findFirst({
    where: eq(authSchema.users.email, email),
  });

  if (!user) {
    return { ok: false, error: "Email ou mot de passe incorrect." };
  }

  try {
    // IMPORTANT: on enlève asResponse:true
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    return { ok: true, role: user.role };
  } catch {
    return { ok: false, error: "Email ou mot de passe incorrect." };
  }
};

/* ---------- SIGNOUT ---------- */

export const signout = async () => {
  await auth.api.signOut({ headers: await headers() });

  // force rerender serveur du Header après déconnexion
  redirect("/");
};
