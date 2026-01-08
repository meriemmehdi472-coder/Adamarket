"use client"; 

import { deleteProduct } from "@/app/actions/deleteProduct";

export default function AdminDeleteButton({ productId }: { productId: number }) {
  const handleDelete = async (formData: FormData) => {
    if (confirm("Supprimer définitivement ce produit ?")) {
      await deleteProduct(formData);
    }
  };

  return (
    <form action={handleDelete}>
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer border border-red-100"
      >
        Supprimer
      </button>
    </form>
  );
}