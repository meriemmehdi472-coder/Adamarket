import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AccountClient from "./AccountClient";
import { getAllCategorie, getFavoriteProductByUserId, getProductsByOwnerId } from "@/lib/queries";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/auth-schema"
import { eq } from "drizzle-orm"

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/auth/sign-in")

  const [userFromDb] = await db.select().from(users).where(eq(users.id, session.user.id))
  if (!userFromDb) redirect("/auth/sign-in")

  const categories = await getAllCategorie()
  const myProducts = await getProductsByOwnerId(session.user.id)
  const favProducts = await getFavoriteProductByUserId(session.user.id)

  return (
    <main>
      <AccountClient
        user={session.user}
        categories={categories}
        products={myProducts}
        favorites={favProducts}
      />
    </main>
  );
}
