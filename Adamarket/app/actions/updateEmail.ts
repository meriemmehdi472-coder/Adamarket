"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { db } from "@/lib/db/drizzle"
import { users } from "@/lib/db/auth-schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import {z} from "zod"

type ActionResultat = 
  {
    ok : true
  }|{
    ok: false; error: string | number
  }

  const updateEmailSchema = z.object({
    email : z
    .string()
    .trim()
    .min(1, "Email obligatoire")
    .email("Email INVALIDE"),
})

export const updateEmail = async (oldEtat: ActionResultat| null, formData : FormData): Promise<ActionResultat> => {
    const session = await auth.api.getSession({ headers : await headers() })
    const emailNow = session?.user.email

        if (!session?.user)
        redirect("/auth/signin")
        
        const parsed = updateEmailSchema.safeParse({
            email : formData.get("email")
        })

        if(parsed.data?.email === emailNow){
            return { ok: false, error: "c'est déjà ton email"}
        }

        if (!parsed.success){
            const firstMsg = parsed.error.issues[0].message ?? "Email invalide"
            return {ok: false, error : firstMsg}
        }

        try {
            await db.update(users)
            .set({ email:parsed.data.email })
            .where(eq(users.id, session.user.id))
            revalidatePath("/account")
            return { ok: true }
        } catch (error) {
            const erreur = error as any;
            if (erreur?.code === "23505") {
              return { ok: false, error: "désolé cet email est déjà utilisé" };
            }
          
            return { ok: false, error: "Une erreur est survenue réessaie" };
          }
}