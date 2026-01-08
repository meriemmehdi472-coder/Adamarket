"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleFavorite } from "../actions/favorite";


type Props = {
  productId: number;
  initialIsFavorite: boolean;
};

export default function FavoriteButton({ productId, initialIsFavorite }: Props) {
  const router = useRouter();

  const handleClick = async () => {
    await toggleFavorite(productId)
    router.refresh()
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={initialIsFavorite}
      aria-label={initialIsFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      className="
        inline-flex h-9 w-9 items-center justify-center
        rounded-full border border-zinc-200 bg-white/80
        shadow-sm backdrop-blur
        transition
        hover:scale-105 hover:bg-white hover:shadow
        active:scale-95
      "
    >
      <Heart
        className={
          initialIsFavorite
            ? "h-5 w-5 fill-red-500 text-red-500"
            : "h-5 w-5 text-zinc-600"
        }
      />
    </button>
  );
}
