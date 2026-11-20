import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdClose, MdDeleteOutline, MdEdit } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { StatusBadge } from "../../../components/dashboard/StatsCard";

/** Edit form for a Pending application. Name and email are read-only. */
const EditApplicationModal = ({ application, onClose, onSaved }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [form, setForm] = useState({
    qualifications: application.qualifications || "",
    experience: application.experience || "",
    expectedSalary: application.expectedSalary || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const salary = Number(form.expectedSalary);

    if (!form.qualifications.trim() || !form.experience.trim())
      return toast.error("Please fill in your qualifications and experience.");
    if (!salary || salary <= 0) return toast.error("Please enter a valid expected salary.");

    const values = {
      qualifications: form.qualifications.trim(),
      experience: form.experience.trim(),
      expectedSalary: salary,
    };

    setSaving(true);
    try {
      await axiosSecure.patch(`/applications/${application._id}`, values);
      toast.success("Application updated");
      onSaved({ ...application, ...values });
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update the application.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-lg bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-navy">Edit application</h3>
            <p className="mt-1 text-sm text-slate-500">
              {application.tuition?.subject} · {application.tuition?.classLevel}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle" aria-label="Close">
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
              <input
                readOnly
                value={user?.displayName || application.tutorName || ""}
                className="input w-full cursor-not-allowed bg-slate-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input
                readOnly
                value={user?.email || ""}
                className="input w-full cursor-not-allowed bg-slate-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Qualifications</span>
            <input
              name="qualifications"
              value={form.qualifications}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Experience</span>
            <textarea
              name="experience"
              rows={3}
              value={form.experience}
              onChange={handleChange}
              className="textarea w-full"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Expected Salary (৳ / month)
            </span>
            <input
              type="number"
              name="expectedSalary"
              min="1"
              value={form.expectedSalary}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </label>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn-brand-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-brand">
              {saving ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </div>
  );
};

/** Tutor's applications. Edit and delete are allowed only while "Pending". */
const MyApplications = () => {
  const axiosSecure = useAxiosSecure();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/applications/tutor")
      .then(({ data }) => !cancelled && setApplications(Array.isArray(data) ? data : []))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  const handleDelete = async (application) => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Delete this application?",
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(`/applications/${application._id}`);
      setApplications((prev) => prev.filter((a) => a._id !== application._id));
      toast.success("Application deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete the application.");
    }
  };

  const handleSaved = (updated) =>
    setApplications((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));

  if (loading) return <LoadingSpinner label="Loading your applications..." />;

  if (error)
    return (
      <div className="card-surface p-10 text-center text-slate-500">
        Could not load your applications. Please try again later.
      </div>
    );

  if (applications.length === 0)
    return (
      <div className="card-surface p-10 text-center">
        <p className="text-lg font-semibold text-navy">You have not applied to any tuition yet</p>
        <Link to="/tuitions" className="btn-brand mt-5 inline-flex">
          Browse Tuitions
        </Link>
      </div>
    );

  return (
    <>
      <div className="card-surface overflow-x-auto">
        <table className="table">
          <thead className="bg-surface text-navy">
            <tr>
              <th>Tuition</th>
              <th>Location</th>
              <th>Expected Salary</th>
              <th>Applied</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const pending = app.status === "Pending";
              return (
                <tr key={app._id}>
                  <td>
                    <p className="font-semibold text-navy">{app.tuition?.subject || "Tuition"}</p>
                    <p className="text-xs text-slate-500">{app.tuition?.classLevel}</p>
                  </td>
                  <td>{app.tuition?.location || "-"}</td>
                  <td>৳{Number(app.expectedSalary || 0).toLocaleString()}</td>
                  <td className="whitespace-nowrap text-slate-500">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-GB") : "-"}
                  </td>
                  <td>
                    <StatusBadge status={app.status} />
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      {pending ? (
                        <>
                          <button
                            onClick={() => setEditing(app)}
                            className="btn btn-sm btn-square btn-ghost text-teal"
                            aria-label="Edit application"
                            title="Edit"
                          >
                            <MdEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(app)}
                            className="btn btn-sm btn-square btn-ghost text-red-500"
                            aria-label="Delete application"
                            title="Delete"
                          >
                            <MdDeleteOutline className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Locked</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditApplicationModal
          application={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};

export default MyApplications;