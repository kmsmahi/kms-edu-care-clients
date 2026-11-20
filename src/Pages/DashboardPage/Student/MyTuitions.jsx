import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdAdd, MdDeleteOutline, MdEdit } from "react-icons/md";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import TuitionFormModal from "../../../components/dashboard/TuitionFormModal";
import { StatusBadge } from "../../../components/dashboard/StatsCard";

const MyTuitions = () => {
  const axiosSecure = useAxiosSecure();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(null); // tuition being edited

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/tuitions/my")
      .then(({ data }) => !cancelled && setTuitions(Array.isArray(data) ? data : []))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  const handleDelete = async (tuition) => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Delete this tuition?",
      text: `"${tuition.subject}" will be permanently removed.`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(`/tuitions/${tuition._id}`);
      setTuitions((prev) => prev.filter((t) => t._id !== tuition._id));
      toast.success("Tuition deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete the tuition.");
    }
  };

  const handleSaved = (updated) =>
    setTuitions((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));

  if (loading) return <LoadingSpinner label="Loading your tuitions..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-600">
          {tuitions.length} post{tuitions.length === 1 ? "" : "s"}
        </p>
        <Link to="/dashboard/post-tuition" className="btn-brand">
          <MdAdd className="h-5 w-5" /> Post Tuition
        </Link>
      </div>

      {error ? (
        <div className="card-surface p-10 text-center text-slate-500">
          Could not load your tuitions. Please try again later.
        </div>
      ) : tuitions.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <p className="text-lg font-semibold text-navy">You have not posted any tuition yet</p>
          <Link to="/dashboard/post-tuition" className="btn-brand mt-5 inline-flex">
            Post your first tuition
          </Link>
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="table">
            <thead className="bg-surface text-navy">
              <tr>
                <th>Subject</th>
                <th>Class</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Posted</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tuitions.map((tuition) => (
                <tr key={tuition._id}>
                  <td className="font-semibold text-navy">{tuition.subject}</td>
                  <td>{tuition.classLevel}</td>
                  <td>{tuition.location}</td>
                  <td>৳{Number(tuition.budget || 0).toLocaleString()}</td>
                  <td>
                    <StatusBadge status={tuition.status} />
                  </td>
                  <td className="whitespace-nowrap text-slate-500">
                    {tuition.createdAt
                      ? new Date(tuition.createdAt).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(tuition)}
                        className="btn btn-sm btn-square btn-ghost text-teal"
                        aria-label="Edit tuition"
                        title="Edit"
                      >
                        <MdEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tuition)}
                        className="btn btn-sm btn-square btn-ghost text-red-500"
                        aria-label="Delete tuition"
                        title="Delete"
                      >
                        <MdDeleteOutline className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <TuitionFormModal
          tuition={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default MyTuitions;