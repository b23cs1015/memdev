import { LogOut } from "lucide-react";

import { useAuth } from "../../context/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#171717]">
      <header className="border-b border-[#E7E7E2] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold tracking-tight">MemDev</p>
            <p className="text-xs text-slate-500">
              Personal knowledge library
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E7E7E2] bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-[#171717]"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div>
          <p className="text-sm font-medium text-blue-600">Dashboard</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back.
          </h1>

          <p className="mt-2 text-slate-500">
            Signed in as {user?.email}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-[#E7E7E2] bg-white p-8">
          <h2 className="text-lg font-semibold">Your knowledge library</h2>

          <p className="mt-2 text-sm text-slate-500">
            Your saved knowledge will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;