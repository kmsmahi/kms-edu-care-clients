import { useEffect, useState } from "react";
import { MdAttachMoney, MdGroups, MdMenuBook, MdReceiptLong } from "react-icons/md";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import StatsCard, { formatMoney } from "../../../components/dashboard/StatsCard";
import AnalyticsCharts from "../../../components/dashboard/AnalyticsCharts";
import PaginationControls from "../../../components/tuitions/PaginationControls";

const PAGE_SIZE = 10;

/** Platform earnings, successful transactions and charts. */
const ReportsAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/admin/reports")
      .then(({ data }) => !cancelled && setReport(data || {}))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner label="Building reports..." />;

  if (error || !report)
    return (
      <div className="card-surface p-10 text-center text-slate-500">
        Could not load reports. Please try again later.
      </div>
    );

  const {
    totalEarnings = 0,
    currency = "BDT",
    totalUsers = 0,
    totalTuitions = 0,
    transactions = [],
    monthlyEarnings = [],
    userRoles = [],
    tuitionStatuses = [],
  } = report;

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const pageRows = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8">
      {/* Headline numbers */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Earnings" value={formatMoney(totalEarnings, currency)} Icon={MdAttachMoney} tone="green" />
        <StatsCard title="Transactions" value={transactions.length} Icon={MdReceiptLong} tone="navy" />
        <StatsCard title="Total Users" value={totalUsers} Icon={MdGroups} tone="teal" />
        <StatsCard title="Tuition Posts" value={totalTuitions} Icon={MdMenuBook} tone="amber" />
      </div>

      {/* Charts */}
      <AnalyticsCharts
        monthly={monthlyEarnings}
        roles={userRoles}
        statuses={tuitionStatuses}
        currency={currency}
      />

      {/* Transaction history */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-navy">Successful Transactions</h3>

        {transactions.length === 0 ? (
          <div className="card-surface p-10 text-center text-slate-500">
            No successful transactions yet.
          </div>
        ) : (
          <>
            <div className="card-surface overflow-x-auto">
              <table className="table">
                <thead className="bg-surface text-navy">
                  <tr>
                    <th>Date</th>
                    <th>Tuition</th>
                    <th>Student</th>
                    <th>Tutor</th>
                    <th>Transaction ID</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((t) => (
                    <tr key={t._id}>
                      <td className="whitespace-nowrap text-slate-500">
                        {t.paidAt || t.createdAt
                          ? new Date(t.paidAt || t.createdAt).toLocaleDateString("en-GB")
                          : "-"}
                      </td>
                      <td className="font-semibold text-navy">{t.tuitionSubject || "-"}</td>
                      <td>{t.studentName || t.studentEmail || "-"}</td>
                      <td>{t.tutorName || t.tutorEmail || "-"}</td>
                      <td className="max-w-48 truncate font-mono text-xs text-slate-500">
                        {t.transactionId}
                      </td>
                      <td className="whitespace-nowrap text-right font-bold text-navy">
                        {formatMoney(t.amount, t.currency || currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalytics;