import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { StatCard, PageLoader, fmtCurrency } from "../components/ui/index.jsx";
import { Users, Zap, IndianRupee, TrendingUp, Leaf } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics")
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return <p className="text-gray-500">Failed to load analytics.</p>;

  const { kpis, topProjects, monthlyActivity, roiDistribution } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={kpis.totalUsers} icon={Users} color="blue" />
        <StatCard label="Total Capital" value={fmtCurrency(kpis.totalCapital)} icon={IndianRupee} color="amber" />
        <StatCard label="Portfolio Value" value={fmtCurrency(kpis.portfolioValue)} icon={TrendingUp} color="green" sub={`+${fmtCurrency(kpis.totalReturns)} returns`} />
        <StatCard label="CO₂ Offset" value={`${(kpis.totalCo2Offset || 0).toFixed(1)} t`} icon={Leaf} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Investment Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={60} />
              <Tooltip formatter={(v) => [fmtCurrency(v), "Amount"]} />
              <Bar dataKey="totalAmount" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">ROI Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={roiDistribution} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={80} label={({ range, count }) => `${range}: ${count}`}>
                {roiDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Top Funded Projects</h2>
        <div className="space-y-4">
          {topProjects.map((p, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                <span className="text-gray-500">{fmtCurrency(p.fundedAmount)} / {fmtCurrency(p.fundingGoal)}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${p.fundingProgress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{p.location}</span>
                <span>{p.fundingProgress}% funded</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
