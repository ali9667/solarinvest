import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import toast from "react-hot-toast";
import { Sun, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fill = (email, password) => setForm({ email, password });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl mb-4 shadow-lg">
            <Sun size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SolarInvest</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="card">
          <div className="flex gap-2 mb-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button type="button" onClick={() => fill("investor@solarinvest.com", "Demo@123")} className="flex-1 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 shadow-sm text-gray-700 dark:text-gray-200 transition">
              Demo Investor
            </button>
            <button type="button" onClick={() => fill("admin@solarinvest.com", "Admin@123")} className="flex-1 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 shadow-sm text-gray-700 dark:text-gray-200 transition">
              Admin
            </button>
          </div>

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} className="input pr-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-amber-600 dark:text-amber-400 hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          New here?{" "}
          <Link to="/register" className="text-amber-600 dark:text-amber-400 font-medium hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
