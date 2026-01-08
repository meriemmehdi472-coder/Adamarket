import { getAllProductsWithSellers } from "@/lib/queries";
import { requireAdmin } from "@/lib/admin";
// Importation du nouveau composant Client pour gérer la suppression avec confirmation
import AdminDeleteButton from "@/app/components/Admindeletebut";

export default async function AdminProductsPage() {
  // 1. Protection de la route : vérifie si l'utilisateur est admin
  await requireAdmin();

  // 2. Récupération de tous les produits avec les infos vendeurs via la requête SQL
  const allProducts = await getAllProductsWithSellers();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion du Catalogue</h1>
        <p className="text-gray-600">Total : {allProducts.length} produits en ligne</p>
      </header>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Produit</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Vendeur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Prix</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {allProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                {/* Infos Produit */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400 font-bold uppercase">
                        {product.title.substring(0, 2)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.title}</div>
                      <div className="text-xs text-gray-500">{product.categoryName}</div>
                    </div>
                  </div>
                </td>

                {/* Infos Vendeur */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{product.sellerName}</div>
                  <div className="text-xs text-gray-500">{product.sellerEmail}</div>
                </td>

                {/* Prix */}
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {product.priceCents / 100} €
                </td>

                {/* Actions de modération via composant Client */}
                <td className="px-6 py-4 text-right">
                  <AdminDeleteButton productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allProducts.length === 0 && (
          <div className="p-10 text-center text-gray-500 italic">
            Aucun produit n'a été trouvé dans la base de données.
          </div>
        )}
      </div>
    </div>
  );
}