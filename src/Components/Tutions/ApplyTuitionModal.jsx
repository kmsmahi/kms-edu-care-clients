import { useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

/**
 * Tutor application form.
 * name + email are read-only; qualifications, experience, expectedSalary are editable.
 * Saved with status "Pending".
 */
const ApplyTuitionModal = ({ tuition, onClose, onApplied }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [form, setForm] = useState({
    qualifications: "",
    experience: "",
    expectedSalary: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const salary = Number(form.expectedSalary);
    if (!form.qualifications.trim() || !form.experience.trim()) {
      return toast.error("Please fill in your qualifications and experience.");
    }
    if (!salary || salary <= 0) {
      return toast.error("Please enter a valid expected salary.");
    }

    setSubmitting(true);
    try {
      await axiosSecure.post("/applications", {
        tuitionId: tuition._id,
        tutorName: user.displayName || "",
        tutorEmail: user.email,
        tutorPhoto: user.photoURL || "",
        qualifications: form.qualifications.trim(),
        experience: form.experience.trim(),
        expectedSalary: salary,
        status: "Pending",
      });
      toast.success("Application submitted successfully!");
      onApplied?.();
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not submit your application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-lg bg-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-navy">Apply for this tuition</h3>
            <p className="mt-1 text-sm text-slate-500">
              {tuition.subject} · {tuition.classLevel} · {tuition.location}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close"
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                readOnly
                value={user?.displayName || ""}
                className="input w-full cursor-not-allowed bg-slate-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className="input w-full cursor-not-allowed bg-slate-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Qualifications
            </span>
            <input
              type="text"
              name="qualifications"
              value={form.qualifications}
              onChange={handleChange}
              placeholder="e.g. B.Sc. in Mathematics, CU"
              className="input w-full"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Experience
            </span>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows={3}
              placeholder="Tell the student about your teaching experience"
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
              placeholder="e.g. 5000"
              className="input w-full"
              required
            />
          </label>

          <div className="modal-action mt-6">
            <button type="button" onClick={onClose} className="btn-brand-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-brand">
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Click outside to close */}
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </div>
  );
};

export default ApplyTuitionModal;