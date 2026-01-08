"use client"
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { updateProduct } from "../actions/updateProduct";



type Category = { id: number; name: string };

  type Product = {
    id: number;
    title: string;
    description: any;
    priceCents: number;
    imageUrl: string | null;
    categoryId: number;
    isPublished: boolean;
  };


export default  function EditProductForm ({product, categories}:{product: Product, categories:Category[]}) {

    const [imageUrl, setImageUrl] = useState(product.imageUrl ?? "")


    return (

        <div>
            <form action={updateProduct} className="p-10 flex flex-col text-align gap-5 text-center justify-self-center ">


                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="imageUrl" value={imageUrl} />

                <label htmlFor="title" className="text-sm font-medium text-black">Titre :</label>
                <input type="text" name="title" id="title" defaultValue={product.title}
                    className="w-4xl rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200">
                </input>

                <label htmlFor="priceCents" className="text-sm font-medium text-black">Prix :</label>
                <input type="number" name="priceCents" id="priceCents" defaultValue={product.priceCents}
                    className="w-4xl rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                />

                <label htmlFor="description" className="text-sm font-medium text-black">Description :</label>
                <textarea name="description" id="description" defaultValue={product.description}
                    className="w-4xl resize-none rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
                >
                </textarea>

                <label htmlFor="categoryId" className="text-sm font-medium text-black">Catégorie du produit :</label>
                <select name="categoryId" id="categories" className="w-4xl rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200" defaultValue={product.categoryId}>
                    <option value="" disabled>Selectionne la catégorie</option>
                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <div className="space-y-1">
                <label className="text-sm font-medium text-black">Image</label>
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result: any) => {
                        const publicId = result?.info?.public_id;
                        if (publicId) setImageUrl(publicId);
                    }}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Ajouter une image
                        </button>
                    )}
                </CldUploadWidget>
                <input type="hidden" name="imageUrl" value={imageUrl} />

                {imageUrl && (
                    <p className="text-xs text-black">
                        Image ajoutée
                    </p>
                )}
            </div>
            <div className="flex flex-row gap-5 pt-2">
                <button
                    type="reset"
                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                    Reset
                </button>
                <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    Modifier
                </button>
            </div>
            </form>
        </div>
    )
}