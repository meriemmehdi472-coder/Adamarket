import { getCategorieBySlug, getFavoriteProductId, getProductsByCategorySlug } from "@/lib/queries";
import ProductCard from "@/app/components/ProductCardSlug";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type PageProps = {
  params: { slug: string };
};

export default async function CategoriesSlug({ params }: PageProps) {
  const {slug} = await params
  const normalizedSlug = decodeURIComponent(slug).trim().toLowerCase();

  const categorie = await getCategorieBySlug(normalizedSlug);
  if (!categorie) return <main>Catégorie introuvable</main>;

  const produits = await getProductsByCategorySlug(normalizedSlug);

  const session = await auth.api.getSession({headers: await headers()})
  const userId = session?.user?.id
  const favId = userId ? await getFavoriteProductId(userId) : []


  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {produits.map((p) => (
          <li key={p.id}>
            <ProductCard
              id={p.id}
              showFavorite={Boolean(userId)}
              initialIsFavorite={favId.includes(p.id)}
              title={p.title}
              priceCents={p.priceCents /100}
              imageUrl={p.imageUrl}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
