
import Link from "next/link";
import { auth } from "@/lib/auth";
import {signout} from "@/app/actions/connect"
import { headers } from "next/headers";
export const Header = async () => {
  const session = await auth.api.getSession({headers: await headers(),});

  return (
    <header className="flex flex-col items-center gap-4 mb-10 border-b border-zinc-600 px-4 py-4 md:flex-row md:px-10">
      <Link href="/" className="m-10 text-3xl font-semibold">
        AdaMarketPlace
      </Link>

      <div className="flex gap-4 md:ml-auto md:gap-8">
        {!session && (
          <>
            <Link href="/auth/sign-up" className="font-semibold">
              S'inscrire
            </Link>
            <Link href="/auth/sign-in" className="font-semibold">
              Se connecter
            </Link>
          </>
        )}

        {session && (
          <>
            <Link href="/account" className="font-semibold">
              Mon compte
            </Link>
             {/* {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="font-semibold text-red-500"
              >
                Admin
              </Link>
            )} */}

            <form action={signout} >
              <button className="font-semibold">
                Déconnexion
              </button>
            </form>
          </>
        )}
      </div>
    </header>
  );
};
