import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { StatCard, PageLoader, fmtCurrency } from "../components/ui/index.jsx";
import { TrendingUp, Wallet, Leaf, Activity, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/investments/portfolio")
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const s = data?.summary;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your solar investment overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Invested" value={fmtCurrency(s?.totalInvested)} icon={Wallet} color="amber" />
        <StatCard label="Portfolio Value" value={fmtCurrency(s?.portfolioValue)} icon={TrendingUp} color="green" sub={s?.totalReturns >= 0 ? `+${fmtCurrency(s?.totalReturns)} returns` : fmtCurrency(s?.totalReturns)} />
        <StatCard label="CO₂ Offset" value={`${(s?.co2Offset || 0).toFixed(2)} t`} icon={Leaf} color="blue" sub="carbon offset to date" />
        <StatCard label="Active Investments" value={s?.activeCount || 0} icon={Activity} color="purple" sub={`${s?.withdrawnCount || 0} withdrawn`} />
      </div>

      {data?.growthData?.length > 0 && (
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Portfolio Growth (12 months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={60} />
              <Tooltip formatter={(v) => [fmtCurrency(v), "Value"]} />
              <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card flex flex-col gap-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <Link to="/projects" className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition">
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Browse Projects</span>
            <ArrowRight size={16} className="text-amber-500" />
          </Link>
          <Link to="/portfolio" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Portfolio</span>
            <ArrowRight size={16} className="text-gray-400" />
          </Link>
          <Link to="/transactions" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction History</span>
            <ArrowRight size={16} className="text-gray-400" />
          </Link>
        </div>

        {data?.investments?.slice(0, 3).length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Investments</h3>
            <div className="space-y-3">
              {data.investments.slice(0, 3).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{inv.projectName}</p>
                    <p className="text-xs text-gray-500">{inv.roi}% ROI · {inv.monthsElapsed.toFixed(0)} months</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">{fmtCurrency(inv.currentValue)}</p>
                    <p className="text-xs text-gray-400">+{fmtCurrency(inv.totalReturns)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
