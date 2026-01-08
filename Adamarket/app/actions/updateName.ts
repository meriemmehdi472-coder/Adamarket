"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { db } from "@/lib/db/drizzle"
import { users } from "@/lib/db/auth-schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export const updateName = async (formData : FormData) => {
    const session = await auth.api.getSession({ headers : await headers() })

        if (!session?.user)
        redirect("/auth/signin")

    const name = (formData.get("name") as string)
        if(!name) {
            redirect("/account")
        }

    await db.update(users)
        .set({ name })
        .where(eq(users.id, session.user.id))

    revalidatePath("/account")
    redirect("/account")
}