import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAllCategorie, getAllProducts, getFavoriteProductId } from "@/lib/queries";
import { Categories } from "./components/Categories";



export default async function Home() {
    const session = await auth.api.getSession({ headers: await headers() });

    const allProducts= await getAllProducts()
    const allCategories = await getAllCategorie()

    const products = allProducts.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category_id: item.categoryId,
      image_url: item.imageUrl, 
    }));
    
    const favId = session?.user?.id
    ? await getFavoriteProductId(session.user.id) : []

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 grid gap-8 md:grid-cols-[220px,1fr]">

      <Categories categories={allCategories} products={products} favId={favId}></Categories>

      
  </main>
  );
}
