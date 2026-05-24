import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // Your better-auth setup
import { headers } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Verify if user is logged in and is an ADMIN
  if (!session || session.user.role !== "admin") {
    redirect("/"); // Unauthorized users redirected to home
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8 text-emerald-400">QuizMint Admin</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-emerald-300">Dashboard</a>
          <a href="/admin/quizzes" className="block hover:text-emerald-300">Manage Quizzes</a>
          <a href="/admin/withdrawals" className="block hover:text-emerald-300">Payout Requests</a>
        </nav>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
