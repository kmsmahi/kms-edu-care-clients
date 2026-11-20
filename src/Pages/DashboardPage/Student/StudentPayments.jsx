import { useEffect, useState } from "react";
import { MdPayments, MdReceiptLong } from "react-icons/md";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/Shared/LoadingSpinner";
import StatsCard, { formatMoney } from "../../../Components/Dashboard/StatsCard";

/** Payment history for the logged-in student. */
const StudentPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/payments/student")
      .then(({ data }) => !cancelled && setPayments(Array.isArray(data) ? data : []))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner label="Loading payments..." />;

  const currency = payments[0]?.currency || "BDT";
  const total = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <StatsCard title="Total Paid" value={formatMoney(total, currency)} Icon={MdPayments} tone="green" />
        <StatsCard title="Transactions" value={payments.length} Icon={MdReceiptLong} tone="navy" />
      </div>

      {error ? (
        <div className="card-surface p-10 text-center text-slate-500">
          Could not load your payments. Please try again later.
        </div>
      ) : payments.length === 0 ? (
        <div className="card-surface p-10 text-center text-slate-500">
          No payments yet. Accept a tutor to make your first payment.
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="table">
            <thead className="bg-surface text-navy">
              <tr>
                <th>Date</th>
                <th>Tuition</th>
                <th>Tutor</th>
                <th>Transaction ID</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="whitespace-nowrap text-slate-500">
                    {p.paidAt || p.createdAt
                      ? new Date(p.paidAt || p.createdAt).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td className="font-semibold text-navy">{p.tuitionSubject || "-"}</td>
                  <td>{p.tutorName || p.tutorEmail || "-"}</td>
                  <td className="max-w-48 truncate font-mono text-xs text-slate-500">
                    {p.transactionId}
                  </td>
                  <td className="whitespace-nowrap text-right font-bold text-navy">
                    {formatMoney(p.amount, p.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentPayments;