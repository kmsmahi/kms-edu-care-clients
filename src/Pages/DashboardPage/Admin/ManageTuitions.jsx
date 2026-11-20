import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdCheck, MdClose } from "react-icons/md";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { StatusBadge } from "../../../components/dashboard/StatsCard";

const TABS = ["All", "Pending", "Approved", "Rejected"];

/** Admin moderation of tuition posts: Approve or Reject. */
const ManageTuitions = () => {
  const axiosSecure = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("Pending");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/admin/tuitions")
      .then(({ data }) => !cancelled && setTuitions(Array.isArray(data) ? data : []))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  const updateStatus = async (tuition, status) => {
    if (status === "Rejected") {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "Reject this tuition?",
        text: `"${tuition.subject}" will not be visible to tutors.`,
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, reject",
      });
      if (!isConfirmed) return;
    }

    setBusyId(tuition._id);
    try {
      await axiosSecure.patch(`/admin/tuitions/${tuition._id}/status`, { status });
      setTuitions((prev) =>
        prev.map((t) => (t._id === tuition._id ? { ...t, status } : t))
      );
      toast.success(`Tuition ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update the tuition.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <LoadingSpinner label="Loading tuitions..." />;

  if (error)
    return (
      <div className="card-surface p-10 text-center text-slate-500">
        Could not load tuitions. Please try again later.
      </div>
    );

  const countOf = (name) =>
    name === "All" ? tuitions.length : tuitions.filter((t) => t.status === name).length;
  const visible = tab === "All" ? tuitions : tuitions.filter((t) => t.status === tab);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === name
                ? "bg-navy text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {name} ({countOf(name)})
          </button>
        ))}
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="table">
          <thead className="bg-surface text-navy">
            <tr>
              <th>Tuition</th>
              <th>Student</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Posted</th>
              <th>Status</th>
              <th className="text-right">Moderate</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500">
                  No {tab === "All" ? "" : tab.toLowerCase() + " "}tuitions.
                </td>
              </tr>
            ) : (
              visible.map((t) => (
                <tr key={t._id}>
                  <td>
                    <p className="font-semibold text-navy">{t.subject}</p>
                    <p className="text-xs text-slate-500">{t.classLevel}</p>
                  </td>
                  <td>
                    <p>{t.studentName || "-"}</p>
                    <p className="text-xs text-slate-500">{t.studentEmail}</p>
                  </td>
                  <td>{t.location}</td>
                  <td>৳{Number(t.budget || 0).toLocaleString()}</td>
                  <td className="whitespace-nowrap text-slate-500">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB") : "-"}
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      {t.status !== "Approved" && (
                        <button
                          onClick={() => updateStatus(t, "Approved")}
                          disabled={busyId === t._id}
                          className="btn btn-sm border-0 bg-green-600 text-white hover:bg-green-700"
                        >
                          <MdCheck className="h-4 w-4" /> Approve
                        </button>
                      )}
                      {t.status !== "Rejected" && (
                        <button
                          onClick={() => updateStatus(t, "Rejected")}
                          disabled={busyId === t._id}
                          className="btn btn-sm border border-red-300 bg-white text-red-600 hover:bg-red-50"
                        >
                          <MdClose className="h-4 w-4" /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTuitions;