"use server"
import EditProductForm from "@/app/components/EditProductForm";
import ProductImage from "@/app/components/ProductImage";
import { auth } from "@/lib/auth";
import {getAllCategorie, getProductsById } from "@/lib/queries";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";




type ProductPageParams = {
    id: string;
  }
  
  interface ProductsPageProps {
    params: Promise<ProductPageParams>;
  }

const  EditProductPage = async ({params}: ProductsPageProps) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    
    if(!session){
        redirect("/auth/sign-in")
    }

    const {id} = await params
    const productId = Number(id)
    const product = await getProductsById(productId)
    const categories = await getAllCategorie()

    if(!product){
        return(
        <div>
            <h1 className="text-center text-xl font-semibold">Aucun produit</h1>
            <Link href="/account">Retour au dashboard</Link>
        </div>
        )
    }

    if(product.ownerId !== session.user.id){
        redirect("/")
    }

	return(
        <section>
            <h1 className="text-3xl text-center font-semibold">Modification du produit #{id}</h1>
                <div className="mx-auto max-w-3xl px-4 py-10">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                  </div>
                  {product.imageUrl && (
                    <ProductImage publicId={product.imageUrl} alt={product.title} />
                  )}
            
                <p className="mb-2 text-lg font-semibold">
                {product.description ?? "Pas de description"}
                </p>
                  <p className="mb-1 text-lg font-semibold">
                    Prix :{product.priceCents / 100}
                  </p>
                </div>
                <div>
                <EditProductForm product={product} categories={categories} ></EditProductForm>
                </div>
        </section>
    )
}

export default EditProductPage;