import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { Sun } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset instructions sent!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl mb-4">
            <Sun size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
        </div>
        <div className="card">
          {sent ? (
            <div className="text-center py-4">
              <p className="text-green-600 dark:text-green-400 font-medium mb-2">Check your email!</p>
              <p className="text-sm text-gray-500">We sent reset instructions to <strong>{email}</strong></p>
              <p className="text-xs text-gray-400 mt-2">(In dev mode, check the server console for the token)</p>
            </div>
          ) : (
            <form onSubmit={handle} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-amber-600 dark:text-amber-400 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
