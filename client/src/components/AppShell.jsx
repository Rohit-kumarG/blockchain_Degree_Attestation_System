import {
  BarChart3,
  Building2,
  FileCheck2,
  GraduationCap,
  LogOut,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/universities", label: "Universities", icon: Building2 },
  { to: "/degrees", label: "Degrees", icon: GraduationCap },
  { to: "/verify", label: "Verify", icon: QrCode },
];

export function AppShell({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[#f6f7f4] text-stone-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-stone-200 bg-white lg:block">
        <div className="flex h-20 items-center gap-3 border-b border-stone-200 px-6">
          <div className="flex h-11 w-11 items-center justify-center bg-emerald-700 text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Blockchain</p>
            <h1 className="text-lg font-semibold">Degree Attestation</h1>
          </div>
        </div>

        <nav className="space-y-1 px-4 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-sm font-medium ${
                  isActive ? "bg-emerald-50 text-emerald-900" : "text-stone-600 hover:bg-stone-100"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex min-h-20 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
          <div>
            <p className="text-sm text-stone-500">Signed in as</p>
            <p className="font-semibold">{user?.name || "Unknown user"}</p>
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
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

