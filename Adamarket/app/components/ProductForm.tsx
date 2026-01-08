"use client"

import { useState } from "react";
import { createProduct } from "../actions/product"
import { CldUploadWidget } from "next-cloudinary";


type Category = { 
    id: number
    name:string
}

export const ProductForm = ({ categories }: { categories: Category[] }) => {
  const [imageUrl, setImageUrl] = useState("")
  console.log(imageUrl)

    return (
      <form action={createProduct} className="space-y-4 m-3">
        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium text-black">
            Nom du produit
          </label>
          <input
            name="title"
            id="title"
            placeholder="Pantoufle pokémon"
            required
            className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
          />
        </div>
  
        <div className="space-y-1">
          <label htmlFor="description" className="text-sm font-medium text-black">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            placeholder="Pantoufle pokémon…"
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
          />
        </div>
  
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="priceCents" className="text-sm font-medium text-black">
              Prix
            </label>
            <input
              name="priceCents"
              id="priceCents"
              type="number"
              placeholder="13"
              step="0.01"
              inputMode="decimal"
              required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            />
          </div>
  
          <div className="space-y-1">
            <label htmlFor="categoryId" className="text-sm font-medium text-black">
              Catégorie
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue=""
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
            >
              <option value="" disabled>
                Choisis une catégorie
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
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

          </div>
  
        <div className="flex items-center justify-end gap-3 pt-2">
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
            Ajouter
          </button>
        </div>
      </form>
    );
  };
  