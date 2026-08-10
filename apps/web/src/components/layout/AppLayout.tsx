import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  Folder,
  Hash,
  LayoutDashboard,
  LogOut,
  StickyNote,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Notes",
    to: "/notes",
    icon: StickyNote,
  },
  {
    label: "Collections",
    to: "/collections",
    icon: Folder,
  },
  {
    label: "Tags",
    to: "/tags",
    icon: Hash,
  },
];

function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717]">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-[#E7E7E2] bg-white md:flex md:flex-col">
          <div className="border-b border-[#E7E7E2] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171717] text-white">
                <BookOpen size={18} />
              </div>

              <div>
                <p className="font-semibold tracking-tight">MemDev</p>
                <p className="text-xs text-slate-500">
                  Personal knowledge library
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-slate-100 text-[#171717]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#171717]",
                    ].join(" ")
                  }
                >
                  <Icon size={17} strokeWidth={1.8} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-[#E7E7E2] p-4">
            <div className="mb-3 rounded-lg bg-[#FAFAF8] px-3 py-3">
              <p className="truncate text-sm font-medium">{user?.email}</p>
              <p className="mt-0.5 text-xs text-slate-400">Account</p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-[#171717]"
            >
              <LogOut size={17} strokeWidth={1.8} />
              Log out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-[#E7E7E2] bg-white px-5 md:px-8">
            <div>
              <p className="text-sm text-slate-500">Your workspace</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() ?? "U"}
            </div>
          </header>

          <main className="flex-1 px-5 py-8 md:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;