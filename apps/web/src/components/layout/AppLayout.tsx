import { NavLink, Outlet } from "react-router-dom";
import {
  BookOpen,
  Folder,
  Hash,
  LayoutDashboard,
  LogOut,
  Menu,
  StickyNote,
  X,
} from "lucide-react";
import { useState } from "react";

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

  const [isMobileNavOpen, setIsMobileNavOpen] =
    useState(false);

  function closeMobileNav() {
    setIsMobileNavOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#171717]">
      {/* Mobile overlay */}
      {isMobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeMobileNav}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E7E7E2] bg-white transition-transform duration-200",
          isMobileNavOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#E7E7E2] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E7E2] bg-[#FAFAF8]">
              <BookOpen
                size={16}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="font-semibold tracking-tight">
                MemDev
              </p>

              <p className="text-xs text-[#6B6B68]">
                Personal knowledge library
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileNav}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B6B68] hover:bg-[#FAFAF8] hover:text-[#171717] lg:hidden"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#969692]">
            Workspace
          </p>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileNav}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-[#F2F2EF] text-[#171717]"
                      : "text-[#6B6B68] hover:bg-[#FAFAF8] hover:text-[#171717]",
                  ].join(" ")
                }
              >
                <Icon
                  size={17}
                  strokeWidth={1.8}
                />

                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-[#E7E7E2] p-4">
          <div className="mb-3 rounded-lg bg-[#FAFAF8] px-3 py-3">
            <p className="truncate text-sm font-medium">
              {user?.email}
            </p>

            <p className="mt-0.5 text-xs text-[#969692]">
              Account
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6B6B68] transition hover:bg-[#FAFAF8] hover:text-[#171717]"
          >
            <LogOut
              size={17}
              strokeWidth={1.8}
            />

            Log out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E7E7E2] bg-white/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() =>
                setIsMobileNavOpen(true)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B6B68] hover:bg-[#FAFAF8] hover:text-[#171717] lg:hidden"
            >
              <Menu size={19} />
            </button>

            <div>
              <p className="text-sm font-medium text-[#171717]">
                Your workspace
              </p>

              <p className="hidden text-xs text-[#969692] sm:block">
                Organize what matters.
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F2EF] text-sm font-semibold text-[#171717]">
            {user?.email
              ?.charAt(0)
              .toUpperCase() ?? "U"}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;