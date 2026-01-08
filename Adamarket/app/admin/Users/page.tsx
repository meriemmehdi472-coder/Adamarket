import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/auth-schema";
import { banUser } from "@/app/actions/banuser";
import { requireAdmin } from "@/lib/admin";
import { desc } from "drizzle-orm";

export default async function AdminUsersPage() {
    await requireAdmin();

    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gestion des Utilisateurs</h1>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nom</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rôle</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {allUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                    {user.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {user.email}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {user.isBanned ? (
                                        <span className="inline-flex items-center text-red-600 font-semibold text-sm">
                                            <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                                            Banni
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center text-green-600 font-medium text-sm">
                                            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                                            Actif
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {!user.isBanned && user.role !== "admin" && (
                                        <form action={banUser.bind(null, user.id)}>
                                            <button
                                                type="submit"
                                                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-all cursor-pointer"
                                            >
                                                Bannir
                                            </button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}