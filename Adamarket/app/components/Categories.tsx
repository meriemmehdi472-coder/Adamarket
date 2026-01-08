"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import FavoriteButton from "./FavoriteButton";

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: Date | string;
};

type Products = {
  id: number;
  title: string;
  slug: string;
  category_id: number;
  image_url: string | null;
};

type CategoriesProps = {
  categories: Category[];
  products: Products[];
  favId: number[];
};

export const Categories = ({ categories, products, favId }: CategoriesProps) => {
  return (
    <section className="mb-8 border-zinc-700 pb-4">
      <h2 className="mb-10 text-xl font-semibold">Catégories</h2>

      <ul className="mt-15 flex flex-col gap-10">
        {categories.map((category) => {
          const allProductsForCategory = products.filter(
            (product) => product.category_id === category.id
          );

          const total = allProductsForCategory.length;
          const productsForCategory = allProductsForCategory.slice(0, 4);
          const hasMore = total > 4;

          return (
            <li key={category.id} className="space-y-3">
              <Link
                href={`/categories/${category.slug}`}
                className="
                  block rounded-2xl
                  bg-linear-to-r from-zinc-900 to-zinc-700
                  px-5 py-3
                  text-white
                  shadow-sm
                  transition hover:shadow-md hover:-translate-y-0.5
                "
              >
                <span className="text-xs uppercase tracking-widest text-zinc-200">
                  Catégorie
                </span>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <div className="text-lg font-bold">{category.name}</div>
                  <div className="text-sm text-zinc-300">{total} produits</div>
                </div>
              </Link>

              {productsForCategory.length > 0 ? (
                <>
                  <ul className="grid grid-cols-1 gap-4 pl-2 sm:grid-cols-2">
                    {productsForCategory.map((product) => (
                      <li
                        key={product.id}
                        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
                      >
                        <Link
                          href={`/products/${product.id}`}
                          className="group block"
                        >
                          <div className="relative h-40 w-full bg-zinc-100">
                            {product.image_url ? (
                              <CldImage
                                src={product.image_url}
                                width="800"
                                height="500"
                                alt={product.title}
                                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="h-full w-full" />
                            )}
                          </div>

                          <div className="p-4 pb-2">
                            <h3 className="line-clamp-2 text-base font-semibold text-zinc-900">
                              {product.title}
                            </h3>
                          </div>
                        </Link>

                        <div className="flex items-center justify-between px-4 pb-4">
                          <Link
                            href={`/products/${product.id}`}
                            className="text-sm text-zinc-500 hover:text-zinc-700"
                          >
                            Voir le produit →
                          </Link>

                          <FavoriteButton
                            productId={product.id}
                            initialIsFavorite={favId.includes(product.id)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>

                  {hasMore && (
                    <div className="pl-2">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="inline-block rounded-xl border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                      >
                        Voir les {total - 4} autres →
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <p className="pl-4 text-sm text-zinc-400">
                  Aucun produit dans cette catégorie
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
