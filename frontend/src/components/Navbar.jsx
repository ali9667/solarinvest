import { Menu, Sun, Moon, LogOut, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useTheme } from "../auth/ThemeContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
      <button onClick={onMenuClick} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <User size={15} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="ml-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
