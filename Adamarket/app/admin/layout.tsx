import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    const user = await requireAdmin();
    console.log("Accès autorisé pour:", user.email);
  } catch (error) {
    console.error("Redirection car:", error);
    redirect("/"); // Vers l'accueil si pas admin
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-gray-900 text-white p-6">
            <nav className="space-y-4">
                <a href="/admin" className="block">Dashboard</a>
                <a href="/admin/Users" className="block">Utilisateurs</a>
            </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
    </div>
  );
}