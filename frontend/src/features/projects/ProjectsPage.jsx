import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { PageLoader, EmptyState, fmtCurrency } from "../../components/ui/index.jsx";
import { Search, MapPin, Zap, TrendingUp, IndianRupee, X } from "lucide-react";

function InvestModal({ project, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const months = 12;
  const preview = amount >= 100
    ? parseFloat((Number(amount) * Math.pow(1 + project.roi / 100 / 12, months)).toFixed(2))
    : 0;

  const handle = async (e) => {
    e.preventDefault();
    if (Number(amount) < 100) return toast.error("Minimum investment is ₹100");
    setLoading(true);
    try {
      await api.post("/investments", { projectId: project._id, amount: Number(amount) });
      toast.success(`Invested ${fmtCurrency(amount)} in ${project.name}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Invest in {project.name}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <form onSubmit={handle} className="p-5 space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-700 dark:text-amber-300">
            ROI: <strong>{project.roi}% p.a.</strong> · Compound monthly
          </div>
          <div>
            <label className="label">Investment Amount (₹)</label>
            <input type="number" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Min. ₹100" min={100} required />
          </div>
          {preview > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
              <p className="text-gray-500 dark:text-gray-400">Projected value after 12 months</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{fmtCurrency(preview)}</p>
              <p className="text-green-500 text-xs">+{fmtCurrency(preview - Number(amount))} returns</p>
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Processing…" : "Confirm Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [selected, setSelected] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      const r = await api.get(`/projects?${params}`);
      setProjects(r.data.data);
      setMeta(r.data.meta.pagination || {});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetch(); };

  const badgeClass = (s) => s === "active" ? "badge-active" : s === "funded" ? "badge-funded" : "badge-closed";

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Solar Projects</h1>

      <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search projects…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="input w-36" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="funded">Funded</option>
          <option value="closed">Closed</option>
        </select>
      </form>

      {loading ? <PageLoader /> : projects.length === 0 ? (
        <EmptyState icon={Zap} title="No projects found" desc="Try adjusting your search filters" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p._id} className="card hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug flex-1 pr-2">{p.name}</h3>
                <span className={badgeClass(p.status)}>{p.status}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1"><MapPin size={11} />{p.location}</p>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{p.description}</p>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400">ROI</p>
                  <p className="text-sm font-bold text-amber-500">{p.roi}%</p>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400">Capacity</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{(p.capacity / 1000).toFixed(0)}MW</p>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-400">Funded</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{p.fundingProgress}%</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${p.fundingProgress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{fmtCurrency(p.fundedAmount)}</span>
                  <span>Goal: {fmtCurrency(p.fundingGoal)}</span>
                </div>
              </div>

              <button
                onClick={() => setSelected(p)}
                disabled={p.status !== "active"}
                className={`mt-auto btn-primary w-full text-sm py-2 ${p.status !== "active" ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {p.status === "active" ? "Invest Now" : p.status === "funded" ? "Fully Funded" : "Closed"}
              </button>
            </div>
          ))}
        </div>
      )}

      {(meta.hasPrev || meta.hasNext) && (
        <div className="flex items-center justify-center gap-3">
          <button className="btn-secondary" disabled={!meta.hasPrev} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span className="text-sm text-gray-500">Page {meta.page} of {meta.pages}</span>
          <button className="btn-secondary" disabled={!meta.hasNext} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {selected && <InvestModal project={selected} onClose={() => setSelected(null)} onSuccess={fetch} />}
    </div>
  );
}
