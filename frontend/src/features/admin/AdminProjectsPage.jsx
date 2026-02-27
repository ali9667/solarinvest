import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";
import { PageLoader, EmptyState, fmtCurrency } from "../../components/ui/index.jsx";
import { Plus, Pencil, Trash2, X, FolderOpen } from "lucide-react";

const EMPTY_FORM = { name: "", description: "", location: "", capacity: "", roi: "", fundingGoal: "" };

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(project ? { name: project.name, description: project.description || "", location: project.location, capacity: project.capacity, roi: project.roi, fundingGoal: project.fundingGoal } : EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project) {
        await api.put(`/projects/${project._id}`, form);
        toast.success("Project updated");
      } else {
        await api.post("/projects", form);
        toast.success("Project created");
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const f = (k) => ({ value: form[k], onChange: (e) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg my-4">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">{project ? "Edit Project" : "New Project"}</h2>
          <button onClick={onClose} className="p-1 text-gray-400"><X size={18} /></button>
        </div>
        <form onSubmit={handle} className="p-5 space-y-4">
          <div>
            <label className="label">Project Name</label>
            <input className="input" {...f("name")} placeholder="Rajasthan Solar Park" required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none h-20" {...f("description")} placeholder="Brief project description…" />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" {...f("location")} placeholder="Jodhpur, Rajasthan" required />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Capacity (kW)</label>
              <input type="number" className="input" {...f("capacity")} placeholder="50000" required min={1} />
            </div>
            <div>
              <label className="label">ROI (%)</label>
              <input type="number" className="input" {...f("roi")} placeholder="12.5" required min={0.1} max={50} step={0.1} />
            </div>
            <div>
              <label className="label">Goal (₹)</label>
              <input type="number" className="input" {...f("fundingGoal")} placeholder="5000000" required min={1000} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving…" : project ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get(`/projects?page=${page}&limit=10&includeDeleted=false`);
      setProjects(r.data.data);
      setMeta(r.data.meta.pagination || {});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p._id);
    try {
      await api.delete(`/projects/${p._id}`);
      toast.success("Project deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const badgeClass = (s) => s === "active" ? "badge-active" : s === "funded" ? "badge-funded" : "badge-closed";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
        <button onClick={() => setModal({ type: "create" })} className="btn-primary text-sm">
          <Plus size={16} /> New Project
        </button>
      </div>

      {loading ? <PageLoader /> : !projects.length ? (
        <EmptyState icon={FolderOpen} title="No projects yet" desc="Create your first solar project" action={<button onClick={() => setModal({ type: "create" })} className="btn-primary">Create Project</button>} />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="p-4">Name</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-right">ROI</th>
                <th className="p-4 text-right">Goal</th>
                <th className="p-4 text-right">Funded</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 font-medium text-gray-900 dark:text-white max-w-48">
                    <p className="truncate">{p.name}</p>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">{p.location}</td>
                  <td className="p-4 text-right text-amber-500 font-medium">{p.roi}%</td>
                  <td className="p-4 text-right text-gray-700 dark:text-gray-300">{fmtCurrency(p.fundingGoal)}</td>
                  <td className="p-4 text-right">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300">{p.fundingProgress}%</span>
                      <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1 ml-auto">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${p.fundingProgress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><span className={badgeClass(p.status)}>{p.status}</span></td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setModal({ type: "edit", project: p })} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-amber-500 transition">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p)} disabled={deleting === p._id} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition disabled:opacity-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(meta.hasPrev || meta.hasNext) && (
        <div className="flex items-center justify-center gap-3">
          <button className="btn-secondary" disabled={!meta.hasPrev} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span className="text-sm text-gray-500">Page {meta.page} of {meta.pages}</span>
          <button className="btn-secondary" disabled={!meta.hasNext} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {modal?.type === "create" && <ProjectModal onClose={() => setModal(null)} onSave={load} />}
      {modal?.type === "edit" && <ProjectModal project={modal.project} onClose={() => setModal(null)} onSave={load} />}
    </div>
  );
}
