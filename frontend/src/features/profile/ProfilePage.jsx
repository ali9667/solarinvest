import { useState } from "react";
import api from "../../api/axios.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import toast from "react-hot-toast";
import { User, Lock } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const r = await api.put("/auth/profile", { name });
      updateUser(r.data.data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) return toast.error("Passwords do not match");
    if (pw.newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setSavingPw(true);
    try {
      await api.put("/auth/change-password", { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success("Password changed. Please log in again.");
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>

      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <User size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Personal Info</h2>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed" value={user?.email || ""} disabled />
          </div>
          <div>
            <label className="label">Role</label>
            <input className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed capitalize" value={user?.role || ""} disabled />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary">
            {savingProfile ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Lock size={18} className="text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Change Password</h2>
        </div>
        <form onSubmit={savePassword} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required minLength={6} />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
          </div>
          <button type="submit" disabled={savingPw} className="btn-primary">
            {savingPw ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
