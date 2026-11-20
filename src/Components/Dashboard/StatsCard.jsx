const tones = {
  navy: "bg-navy/10 text-navy",
  teal: "bg-teal/10 text-teal",
  amber: "bg-amber-100 text-amber-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
};

/** Formats a money amount with its currency, e.g. "BDT 5,000.00". */
export const formatMoney = (amount = 0, currency = "BDT") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency).toUpperCase(),
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  } catch {
    return `${currency} ${Number(amount || 0).toLocaleString()}`;
  }
};

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

/** Colored pill for Pending / Approved / Rejected statuses. */
export const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
      statusStyles[status] || "bg-slate-100 text-slate-600"
    }`}
  >
    {status || "Unknown"}
  </span>
);

/** Summary metric card used on dashboard overview pages. */
const StatsCard = ({ title, value, Icon, tone = "teal", hint }) => (
  <div className="card-surface flex items-center gap-4 p-5">
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
    >
      {Icon && <Icon className="h-7 w-7" />}
    </div>
    <div className="min-w-0">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="truncate text-2xl font-extrabold text-navy">{value}</p>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  </div>
);

export default StatsCard;