"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";

import { ProductForm } from "@/app/components/ProductForm";
import ProductCardSlug from "../components/ProductCardSlug";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { useRouter } from "next/navigation";

import { updateName } from "../actions/updateName";
import { updateEmail } from "../actions/updateEmail";
import { updatePassword } from "../actions/updatePassword";
import { deleteProduct } from "../actions/deleteProduct";

type Category = {
  id: number;
  name: string;
};

type Products = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
  isPublished: boolean;
  categoryId: number;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  categoryName: string;
};

type FavoriteProduct = {
  id: number;
  title: string;
  priceCents: number;
  imageUrl: string | null;
  slug?: string;
};

export default function AccountClient({
  user,
  categories,
  products,
  favorites,
}: {
  user: any;
  categories: Category[];
  products: Products[];
  favorites: FavoriteProduct[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailState, emailAction] = useActionState(updateEmail, null);
  const [passwordState, passwordAction] = useActionState(updatePassword, null);

  const router = useRouter();

  useEffect(() => {
    if (emailState?.ok === true) setShowEmail(false);
  }, [emailState]);

  useEffect(() => {
    if (passwordState?.ok === true) setShowPasswordForm(false);
  }, [passwordState]);

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-8 sm:max-w-2xl sm:px-6 sm:py-12 lg:max-w-4xl lg:px-8">
      <header className="text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          Mon compte
        </h1>
        <p className="mt-2 text-sm text-black sm:text-base">
          Infos de ton profil et gestion de tes produits.
        </p>
      </header>

      {/* Bandeau admin */}
      {user?.role?.trim() === "admin" && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-purple-500 bg-purple-50 p-6 shadow-lg sm:flex-row">
          <div>
            <h3 className="text-lg font-bold text-purple-900">
              Mode Administrateur
            </h3>
            <p className="text-sm text-purple-700">
              Vous pouvez accéder à la gestion globale de la boutique.
            </p>
          </div>
          <Link
            href="/admin"
            className="w-full rounded-xl bg-purple-600 px-6 py-3 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-purple-700 active:scale-95 sm:w-auto"
          >
            Aller au Dashboard Admin →
          </Link>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-8 sm:p-8 lg:p-10">
        <ul className="space-y-4 text-sm sm:text-base">
          {/* NOM */}
          <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-black">Nom :</span>
            <span className="text-black">{user.name}</span>
          </li>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto sm:text-base cursor-pointer"
              onClick={() => setShowNameForm((show) => !show)}
            >
              Modifier le nom
            </button>
          </div>

          {showNameForm && (
            <form action={updateName} className="space-y-3">
              <input
                name="name"
                type="text"
                defaultValue={user.name}
                className="w-2xs rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />
              <button className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800 sm:w-auto sm:text-base cursor-pointer">
                Valider le changement
              </button>
            </form>
          )}

          {/* EMAIL */}
          <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-black">Email :</span>
            <span className="text-black">{user.email}</span>
          </li>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto sm:text-base cursor-pointer"
              onClick={() => setShowEmail((show) => !show)}
            >
              Modifier l&apos;Email
            </button>
          </div>

          {showEmail && (
            <form action={emailAction} className="space-y-3">
              <input
                name="email"
                defaultValue={user.email}
                className="w-2xs rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />

              {emailState?.ok === false && (
                <p className="mt-2 text-sm text-red-600">{emailState.error}</p>
              )}

              <button className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800 sm:w-auto sm:text-base cursor-pointer">
                Valider le changement
              </button>
            </form>
          )}

          {/* MOT DE PASSE */}
          <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium text-black">Mot de passe :</span>
            <span className="text-black">••••••••</span>
          </li>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto sm:text-base cursor-pointer"
              onClick={() => setShowPasswordForm((s) => !s)}
            >
              Modifier le mot de passe
            </button>
          </div>

          {showPasswordForm && (
  <form action={passwordAction} className="space-y-4">

    {/* Mot de passe actuel */}
    <div className="relative">
      <input
        name="currentPassword"
        type={showCurrent ? "text" : "password"}
        placeholder="Mot de passe actuel"
        className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
      />
      <button
        type="button"
        onClick={() => setShowCurrent((s) => !s)}
        className="absolute right-3 top-2.5 text-gray-500"
      >
        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>

    {/* Nouveau mot de passe */}
    <div className="relative">
      <input
        name="newPassword"
        type={showNew ? "text" : "password"}
        placeholder="Nouveau mot de passe"
        className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
      />
      <button
        type="button"
        onClick={() => setShowNew((s) => !s)}
        className="absolute right-3 top-2.5 text-gray-500"
      >
        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>

    {/* Confirmer */}
    <div className="relative">
      <input
        name="confirmPassword"
        type={showConfirm ? "text" : "password"}
        placeholder="Confirmer le nouveau mot de passe"
        className="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
      />
      <button
        type="button"
        onClick={() => setShowConfirm((s) => !s)}
        className="absolute right-3 top-2.5 text-gray-500"
      >
        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>

    {passwordState?.ok === false && (
      <p className="text-sm text-red-600">{passwordState.error}</p>
    )}

    {passwordState?.ok === true && (
      <p className="text-sm text-green-700">Mot de passe mis à jour.</p>
    )}

    <button className="w-full rounded-xl bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800">
      Valider le changement
    </button>
  </form>
)}

        </ul>

        {/* AJOUT PRODUIT */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="w-full cursor-pointer rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 sm:w-auto sm:text-base"
            onClick={() => setShowForm((show) => !show)}
          >
            Ajouter un produit
          </button>
        </div>
      </div>

      {/* MODAL AJOUT PRODUIT */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between ">
              <h2 className="text-xl font-semibold">Ajouter un produit</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <ProductForm categories={categories} />
          </div>
        </div>
      )}

      {/* FAVORIS */}
      <div className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold">Mes favoris</h2>

        {favorites.length === 0 ? (
          <p className="text-sm text-black">Tu n’as aucun favori pour le moment.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((p) => (
              <li key={p.id}>
                <ProductCardSlug
                  id={p.id}
                  title={p.title}
                  priceCents={p.priceCents / 100}
                  imageUrl={p.imageUrl}
                  initialIsFavorite={true}
                  showFavorite={true}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MES PRODUITS */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Mes produits</h2>
        {products.length === 0 ? (
          <p className="text-sm text-black">Tu n’as pas encore ajouté de produit.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <Link href={`/products/${product.id}`} className="flex-1">
                  <p className="text-base font-semibold">{product.title}</p>
                  {product.description && (
                    <p className="mt-1 text-sm text-black">{product.description}</p>
                  )}
                  <p className="mt-2 text-sm font-medium">
                    {(product.priceCents / 100).toFixed(2)} €
                  </p>
                </Link>

                <div className="ml-auto flex gap-2">
                  <Link
                    href={`/account/products/${product.id}/edit`}
                    className="rounded-xl bg-amber-500 px-3 py-2 text-white hover:bg-amber-700"
                  >
                    Modifier
                  </Link>
                </div>

                <form action={deleteProduct} className="ml-auto">
                  <input type="hidden" name="productId" value={product.id} />
                  <button className="bg-red-500 hover:bg-red-700 cursor-pointer px-3 py-2 rounded-xl text-white">
                    Supprimer
                  </button>
                </form>
              </div>

              <div className="mt-3 text-xs text-black">Catégorie: {product.categoryName}</div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
