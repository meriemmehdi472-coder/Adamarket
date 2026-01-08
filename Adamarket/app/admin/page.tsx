import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/auth-schema";
import { products } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";
import Link from "next/link"; 

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [{ userCount }] = await db
    .select({
      userCount: sql<number>`count(*)`,
    })
    .from(users);

  const [{ productCount }] = await db
    .select({
      productCount: sql<number>`count(*)`,
    })
    .from(products);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Tableau de bord admin
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 uppercase">Total Utilisateurs</h2>
          <p className="mt-2 text-4xl font-bold text-blue-600">{userCount}</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-sm font-medium text-gray-500 uppercase">Total Produits</h2>
          <p className="mt-2 text-4xl font-bold text-green-600">{productCount}</p>
          <Link href="/admin/products" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
            Voir les produits &rarr;
          </Link>
        </div>
        
      </div>
    </div>
  );
}