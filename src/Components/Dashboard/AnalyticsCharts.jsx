import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "./StatsCard";

const NAVY = "#0F294A";
const TEAL = "#0E8A8C";

const ROLE_COLORS = { student: TEAL, tutor: NAVY, admin: "#F59E0B" };
const STATUS_COLORS = { Pending: "#F59E0B", Approved: "#16A34A", Rejected: "#DC2626" };

/** Wrapper with a fixed height so ResponsiveContainer can measure it. */
const ChartCard = ({ title, isEmpty, className = "", children }) => (
  <div className={`card-surface p-5 ${className}`}>
    <h3 className="mb-4 text-lg font-bold text-navy">{title}</h3>
    <div className="h-72">
      {isEmpty ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          Not enough data to display yet.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

/**
 * Props:
 *  monthly:  [{ month: "Jan 2026", total: 1200 }]
 *  roles:    [{ role: "student", count: 10 }]
 *  statuses: [{ status: "Pending", count: 4 }]
 *  currency: "BDT"
 */
const AnalyticsCharts = ({ monthly = [], roles = [], statuses = [], currency = "BDT" }) => {
  return (
    <div className="space-y-6">
      {/* Earnings over time */}
      <ChartCard title="Monthly Earnings" isEmpty={monthly.length === 0}>
        <BarChart data={monthly} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748B" }} width={60} />
          <Tooltip
            formatter={(value) => [formatMoney(value, currency), "Earnings"]}
            cursor={{ fill: "rgba(14,138,140,0.08)" }}
          />
          <Bar dataKey="total" fill={TEAL} radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users by role */}
        <ChartCard title="Users by Role" isEmpty={roles.length === 0}>
          <PieChart>
            <Pie
              data={roles}
              dataKey="count"
              nameKey="role"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
            >
              {roles.map((entry) => (
                <Cell key={entry.role} fill={ROLE_COLORS[entry.role] || "#94A3B8"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        {/* Tuition posts by status */}
        <ChartCard title="Tuition Posts by Status" isEmpty={statuses.length === 0}>
          <BarChart data={statuses} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#64748B" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748B" }} width={40} />
            <Tooltip cursor={{ fill: "rgba(15,41,74,0.05)" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
              {statuses.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || NAVY} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsCharts;