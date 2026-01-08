"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db/drizzle";
import { account } from "@/lib/db/auth-schema";
import { and, eq, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type UpdatePasswordState = {
  ok: boolean;
  error?: string;
};

export const updatePassword = async (
  _prev: UpdatePasswordState | null,
  formData: FormData
): Promise<UpdatePasswordState> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return { ok: false, error: "Vous devez être connecté." };
  }

  // user OAuth-only => pas de mot de passe local
  const hasLocalPassword = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, session.user.id), isNotNull(account.password)))
    .limit(1);

  if (hasLocalPassword.length === 0) {
    return {
      ok: false,
      error:
        "Ce compte est connecté via Google/GitHub. Le mot de passe se change via ce service.",
    };
  }

  const currentPassword = (formData.get("currentPassword") as string)?.trim();
  const newPassword = (formData.get("newPassword") as string)?.trim();
  const confirmPassword = (formData.get("confirmPassword") as string)?.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { ok: false, error: "Tous les champs sont obligatoires." };
  }

  if (newPassword.length < 8) {
    return { ok: false, error: "Le nouveau mot de passe doit faire 8 caractères minimum." };
  }

  if (newPassword !== confirmPassword) {
    return { ok: false, error: "La confirmation ne correspond pas." };
  }

  try {
    
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      },
    });

    revalidatePath("/account");
    return { ok: true };
  } catch {
    return { ok: false, error: "Ancien mot de passe incorrect." };
  }
};
