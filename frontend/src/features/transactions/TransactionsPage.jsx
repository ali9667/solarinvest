import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { PageLoader, EmptyState, fmtCurrency, fmtDate } from "../../components/ui/index.jsx";
import { ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";

export default function TransactionsPage() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/investments/transactions")
      .then((r) => setTxns(r.data.data))
      .catch(() => toast.error("Failed to load transactions"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>

      <div className="card">
        {!txns.length ? (
          <EmptyState icon={ArrowLeftRight} title="No transactions yet" desc="Your investments and withdrawals will appear here" />
        ) : (
          <div className="space-y-1">
            {txns.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${t.type === "investment" ? "bg-green-100 dark:bg-green-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}>
                    {t.type === "investment"
                      ? <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                      : <TrendingDown size={16} className="text-orange-600 dark:text-orange-400" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{t.type}</p>
                    <p className="text-xs text-gray-400">{t.projectName} · {fmtDate(t.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${t.type === "investment" ? "text-gray-900 dark:text-white" : "text-green-600 dark:text-green-400"}`}>
                    {t.type === "investment" ? "-" : "+"}{fmtCurrency(t.amount)}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{t.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
