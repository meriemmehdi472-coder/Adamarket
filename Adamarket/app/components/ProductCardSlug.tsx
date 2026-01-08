"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import FavoriteButton from "@/app/components/FavoriteButton";

type Props = {
  id: number;
  title: string;
  priceCents: number;
  imageUrl?: string | null;
  initialIsFavorite: boolean;
  showFavorite?: boolean; // cacher las ession
};

export default function ProductCardSlug({
  id,
  title,
  priceCents,
  imageUrl,
  initialIsFavorite,
  showFavorite = true,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${id}`} className="group block">
        <div className="relative h-44 w-full bg-zinc-100">
          {imageUrl ? (
            <CldImage
              src={imageUrl}
              width="900"
              height="600"
              alt={title}
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
      </Link>

      <div className="p-4">
        <h2 className="line-clamp-2 text-base font-semibold text-zinc-900">
          {title}
        </h2>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-zinc-900">
            {(priceCents ).toFixed(2)} €
          </p>

          <div className="flex items-center gap-3">
            <Link
              href={`/products/${id}`}
              className="text-sm text-zinc-500 hover:text-zinc-700"
            >
              Voir →
            </Link>

            {showFavorite && (
              <FavoriteButton
                productId={id}
                initialIsFavorite={initialIsFavorite}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
