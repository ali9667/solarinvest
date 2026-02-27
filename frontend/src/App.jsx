import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth, RequireRole, GuestOnly } from "./auth/guards.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectsPage from "./features/projects/ProjectsPage.jsx";
import PortfolioPage from "./features/portfolio/PortfolioPage.jsx";
import TransactionsPage from "./features/transactions/TransactionsPage.jsx";
import ProfilePage from "./features/profile/ProfilePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProjectsPage from "./features/admin/AdminProjectsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        <Route path="admin/projects" element={<RequireRole role="admin"><AdminProjectsPage /></RequireRole>} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
