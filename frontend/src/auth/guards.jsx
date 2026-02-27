import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

export const RequireRole = ({ role, children }) => {
  const { user } = useAuth();
  return user?.role === role ? children : <Navigate to="/unauthorized" replace />;
};

export const GuestOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};
