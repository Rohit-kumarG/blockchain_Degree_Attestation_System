import {
  BarChart3,
  Building2,
  FileCheck2,
  GraduationCap,
  History,
  LogOut,
  Menu,
  QrCode,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { roles } from "../utils/roleAccess.js";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3, roles: [roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.AUDITOR] },
  { to: "/universities", label: "Universities", icon: Building2, roles: [roles.SUPER_ADMIN] },
  {
    to: "/degrees",
    label: "Degrees",
    icon: GraduationCap,
    roles: [roles.SUPER_ADMIN, roles.UNIVERSITY_ADMIN, roles.UNIVERSITY_STAFF, roles.STUDENT],
  },
  { to: "/verify", label: "Verify", icon: QrCode, roles: Object.values(roles) },
  { to: "/audit", label: "Audit Logs", icon: History, roles: [roles.SUPER_ADMIN, roles.AUDITOR] },
];

export function AppShell({ user, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcefe5_0,#eef2ef_34%,#f7f8f5_100%)] text-stone-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-stone-200 bg-[#fbfcfa] shadow-sm lg:block">
        <SidebarContent user={user} onNavigate={() => setMenuOpen(false)} />
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-stone-950/40"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative h-full w-[min(88vw,320px)] bg-[#fbfcfa] shadow-xl">
            <SidebarContent user={user} onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex min-h-20 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((value) => !value)}
                className="focus-ring inline-flex h-11 w-11 items-center justify-center border border-stone-300 bg-white hover:bg-stone-100 lg:hidden"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <p className="text-sm text-stone-500">Signed in as</p>
                <p className="font-semibold">{user?.name || "Unknown user"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden bg-sky-100 px-3 py-1 text-sm font-medium text-sky-900 sm:inline">
                {user?.role}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="focus-ring inline-flex h-10 items-center gap-2 border border-stone-300 bg-white px-3 text-sm font-medium hover:bg-stone-100"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ user, onNavigate }) {
  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      <div className="flex h-24 items-center gap-3 border-b border-stone-200 px-6">
        <div className="flex h-12 w-12 items-center justify-center bg-emerald-700 text-white shadow-sm">
          <ShieldCheck size={26} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-800">Blockchain</p>
          <h1 className="text-lg font-semibold leading-tight">Degree Attestation</h1>
        </div>
      </div>

      <nav className="space-y-1 px-4 py-6">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `focus-ring flex min-h-12 items-center gap-3 px-3 text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-stone-200 p-5">
        <div className="bg-[#10241c] p-4 text-white">
          <p className="text-sm font-semibold text-emerald-50">System layers</p>
          <p className="mt-1 text-xs leading-5 text-emerald-100">MongoDB records, IPFS metadata, and blockchain proof work together.</p>
        </div>
      </div>
    </>
  );
}
