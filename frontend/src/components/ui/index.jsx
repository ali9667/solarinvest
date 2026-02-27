import { Loader2, Inbox } from "lucide-react";

export const Spinner = ({ size = "md" }) => {
  const sz = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";
  return <Loader2 className={`${sz} animate-spin text-amber-500`} />;
};

export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

export const EmptyState = ({ icon: Icon = Inbox, title, desc, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
      <Icon size={28} className="text-gray-400" />
    </div>
    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
    {desc && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs">{desc}</p>}
    {action}
  </div>
);

export const StatCard = ({ label, value, icon: Icon, color = "amber", sub }) => {
  const colors = {
    amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export const fmtCurrency = (v) => `₹${Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
export const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
