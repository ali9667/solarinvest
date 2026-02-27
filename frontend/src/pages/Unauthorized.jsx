import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
          <ShieldOff size={28} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You don't have permission to view this page.</p>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
}
