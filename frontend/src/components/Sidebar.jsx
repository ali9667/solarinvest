import { NavLink } from "react-router-dom";
import { LayoutDashboard, Zap, PieChart, ArrowLeftRight, User, ShieldCheck, FolderOpen, Sun } from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/projects", icon: Zap, label: "Projects" },
  { to: "/portfolio", icon: PieChart, label: "Portfolio" },
  { to: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { to: "/profile", icon: User, label: "Profile" },
];

const adminNav = [
  { to: "/admin", icon: ShieldCheck, label: "Analytics" },
  { to: "/admin/projects", icon: FolderOpen, label: "Manage Projects" },
];

export default function Sidebar({ open }) {
  const { user } = useAuth();

  return (
    <aside className={`${open ? "w-56" : "w-0 md:w-16"} transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden shrink-0`}>
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200 dark:border-gray-800 h-16">
        <div className="flex items-center justify-center w-8 h-8 bg-amber-500 rounded-lg shrink-0">
          <Sun size={16} className="text-white" />
        </div>
        {open && <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">SolarInvest</span>}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}`
          }>
            <Icon size={18} className="shrink-0" />
            {open && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <>
            {open && <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Admin</p>}
            {adminNav.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}`
              }>
                <Icon size={18} className="shrink-0" />
                {open && <span className="whitespace-nowrap">{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
