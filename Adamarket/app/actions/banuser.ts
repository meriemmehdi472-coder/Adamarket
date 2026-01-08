"use server";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/auth-schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function banUser(userIdToBan: string) {
    const admin = await requireAdmin();
    if (admin.id === userIdToBan) {
        throw new Error("Action impossible : vous ne pouvez pas vous bannir vous-même.");
    }

    await db
        .update(users)
        .set({ isBanned: true })
        .where(eq(users.id, userIdToBan));

    revalidatePath("/admin/Users");
}