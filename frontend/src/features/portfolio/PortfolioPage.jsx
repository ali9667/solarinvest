import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { PageLoader, EmptyState, StatCard, fmtCurrency, fmtDate } from "../../components/ui/index.jsx";
import { PieChart as PieIcon, TrendingUp, Wallet, Leaf } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#f97316"];

export default function PortfolioPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/investments/portfolio")
      .then((r) => setData(r.data.data))
      .catch(() => toast.error("Failed to load portfolio"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleWithdraw = async (id, projectName) => {
    if (!confirm(`Withdraw investment from ${projectName}?`)) return;
    setWithdrawing(id);
    try {
      const r = await api.post(`/investments/${id}/withdraw`);
      toast.success(`Withdrawn ${fmtCurrency(r.data.data.payout)}`);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWithdrawing(null);
    }
  };

  const handleExport = async () => {
    try {
      const r = await api.get("/investments/export/csv", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <PageLoader />;

  const { summary: s, investments, growthData, allocation } = data || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Portfolio</h1>
        <button onClick={handleExport} className="btn-secondary text-sm">Export CSV</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Invested" value={fmtCurrency(s?.totalInvested)} icon={Wallet} color="amber" />
        <StatCard label="Portfolio Value" value={fmtCurrency(s?.portfolioValue)} icon={TrendingUp} color="green" sub={`+${fmtCurrency(s?.totalReturns)} returns`} />
        <StatCard label="CO₂ Offset" value={`${(s?.co2Offset || 0).toFixed(2)} t`} icon={Leaf} color="blue" />
        <StatCard label="Investments" value={`${s?.activeCount || 0} active`} icon={PieIcon} color="purple" sub={`${s?.withdrawnCount || 0} withdrawn`} />
      </div>

      {growthData?.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card lg:col-span-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Portfolio Growth</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={60} />
                <Tooltip formatter={(v) => [fmtCurrency(v), "Value"]} />
                <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {allocation?.length > 0 && (
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Allocation</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={allocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                    {allocation.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => fmtCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Investment Holdings</h2>
        {!investments?.length ? (
          <EmptyState icon={PieIcon} title="No investments yet" desc="Browse projects to start investing" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-2 pr-4">Project</th>
                  <th className="pb-2 pr-4 text-right">Invested</th>
                  <th className="pb-2 pr-4 text-right">Current Value</th>
                  <th className="pb-2 pr-4 text-right">Returns</th>
                  <th className="pb-2 pr-4 text-right">ROI</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {investments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900 dark:text-white">{inv.projectName}</p>
                      <p className="text-xs text-gray-400">{inv.projectLocation}</p>
                    </td>
                    <td className="py-3 pr-4 text-right text-gray-700 dark:text-gray-300">{fmtCurrency(inv.amount)}</td>
                    <td className="py-3 pr-4 text-right font-medium text-gray-900 dark:text-white">{fmtCurrency(inv.currentValue)}</td>
                    <td className="py-3 pr-4 text-right text-green-600 dark:text-green-400">+{fmtCurrency(inv.totalReturns)}</td>
                    <td className="py-3 pr-4 text-right text-amber-500">{inv.roi}%</td>
                    <td className="py-3 pr-4">
                      <span className={inv.status === "active" ? "badge-active" : "badge-withdrawn"}>{inv.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      {inv.status === "active" && (
                        <button onClick={() => handleWithdraw(inv.id, inv.projectName)} disabled={withdrawing === inv.id} className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50">
                          {withdrawing === inv.id ? "…" : "Withdraw"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
