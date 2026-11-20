import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdAttachMoney, MdCheck, MdClose, MdOutlineWorkHistory, MdSchool } from "react-icons/md";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/Shared/LoadingSpinner";
import { StatusBadge } from "../../../Components/Dashboard/StatsCard";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

/**
 * Applicants for the student's tuitions.
 * Accept → Stripe checkout (tutor becomes "Approved" only after payment succeeds).
 * Reject → status "Rejected".
 */
const AppliedTutors = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/applications/student")
      .then(({ data }) => !cancelled && setApplications(Array.isArray(data) ? data : []))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  const handleAccept = (application) =>
    navigate(`/dashboard/checkout/${application._id}`);

  const handleReject = async (application) => {
    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: "Reject this applicant?",
      text: `${application.tutorName} will be marked as Rejected.`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, reject",
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.patch(`/applications/${application._id}/reject`);
      setApplications((prev) =>
        prev.map((a) => (a._id === application._id ? { ...a, status: "Rejected" } : a))
      );
      toast.success("Applicant rejected");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not reject the applicant.");
    }
  };

  if (loading) return <LoadingSpinner label="Loading applicants..." />;

  const visible =
    filter === "All" ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((name) => (
          <button
            key={name}
            onClick={() => setFilter(name)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === name
                ? "bg-navy text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {error ? (
        <div className="card-surface p-10 text-center text-slate-500">
          Could not load applicants. Please try again later.
        </div>
      ) : visible.length === 0 ? (
        <div className="card-surface p-10 text-center text-slate-500">
          {applications.length === 0
            ? "No tutors have applied to your tuitions yet."
            : `No ${filter.toLowerCase()} applications.`}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((app) => (
            <article key={app._id} className="card-surface flex h-full flex-col p-5">
              {/* Tutor header: equal-size avatar */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-teal/30 bg-navy text-lg font-bold text-white">
                  {app.tutorPhoto ? (
                    <img
                      src={app.tutorPhoto}
                      alt={app.tutorName}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    (app.tutorName || "T").charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-navy">{app.tutorName}</h3>
                  <p className="truncate text-xs text-slate-500">
                    For: {app.tuition?.subject || "Tuition"}
                    {app.tuition?.classLevel ? ` · ${app.tuition.classLevel}` : ""}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {/* Application details */}
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <MdSchool className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span>{app.qualifications}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MdOutlineWorkHistory className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  <span className="line-clamp-3">{app.experience}</span>
                </li>
                <li className="flex items-center gap-2 font-semibold text-navy">
                  <MdAttachMoney className="h-4 w-4 shrink-0 text-teal" />
                  ৳{Number(app.expectedSalary || 0).toLocaleString()} / month
                </li>
              </ul>

              {/* Actions */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                {app.status === "Pending" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleAccept(app)} className="btn-brand">
                      <MdCheck className="h-5 w-5" /> Accept
                    </button>
                    <button
                      onClick={() => handleReject(app)}
                      className="btn border border-red-300 bg-white text-red-600 hover:bg-red-50"
                    >
                      <MdClose className="h-5 w-5" /> Reject
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-sm text-slate-500">
                    {app.status === "Approved"
                      ? "Payment completed. This tutor is approved."
                      : "You rejected this application."}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedTutors;