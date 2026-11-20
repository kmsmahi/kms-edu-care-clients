import { useState } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { CLASS_LEVELS } from "../Tutions/TuitionFiltersBar";

const emptyValues = {
  subject: "",
  classLevel: "",
  location: "",
  budget: "",
  daysPerWeek: "",
  description: "",
};

/**
 * Reusable tuition form (create + edit).
 * Pass `initialValues` to pre-fill it; `onSubmit` receives cleaned values.
 */
export const TuitionForm = ({
  initialValues,
  onSubmit,
  submitting = false,
  submitLabel = "Save",
  onCancel,
}) => {
  const [form, setForm] = useState({ ...emptyValues, ...initialValues });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const budget = Number(form.budget);
    const daysPerWeek = Number(form.daysPerWeek);

    if (!form.subject.trim()) return toast.error("Please enter the subject.");
    if (!form.classLevel) return toast.error("Please select the class.");
    if (!form.location.trim()) return toast.error("Please enter the location.");
    if (!budget || budget <= 0) return toast.error("Please enter a valid budget.");
    if (!daysPerWeek || daysPerWeek < 1 || daysPerWeek > 7)
      return toast.error("Days per week must be between 1 and 7.");

    onSubmit({
      subject: form.subject.trim(),
      classLevel: form.classLevel,
      location: form.location.trim(),
      budget,
      daysPerWeek,
      description: form.description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Subject</span>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="e.g. Mathematics"
            className="input w-full"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Class</span>
          <select
            name="classLevel"
            value={form.classLevel}
            onChange={handleChange}
            className="select w-full"
            required
          >
            <option value="">Select class</option>
            {CLASS_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Location</span>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Agrabad, Chattogram"
            className="input w-full"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Budget (৳ / month)
          </span>
          <input
            type="number"
            name="budget"
            min="1"
            value={form.budget}
            onChange={handleChange}
            placeholder="e.g. 5000"
            className="input w-full"
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">Days per week</span>
          <select
            name="daysPerWeek"
            value={form.daysPerWeek}
            onChange={handleChange}
            className="select w-full"
            required
          >
            <option value="">Select days</option>
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <option key={d} value={d}>
                {d} day{d > 1 ? "s" : ""} / week
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-slate-700">
          Description <span className="text-slate-400">(optional)</span>
        </span>
        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          placeholder="Preferred timing, tutor gender, special requirements..."
          className="textarea w-full"
        />
      </label>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-brand-outline">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting} className="btn-brand">
          {submitting ? <span className="loading loading-spinner loading-sm" /> : submitLabel}
        </button>
      </div>
    </form>
  );
};

/** Modal for editing an existing tuition (form pre-filled with current values). */
const TuitionFormModal = ({ tuition, onClose, onSaved }) => {
  const axiosSecure = useAxiosSecure();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await axiosSecure.patch(`/tuitions/${tuition._id}`, values);
      toast.success("Tuition updated successfully");
      onSaved({ ...tuition, ...values });
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update the tuition.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-2xl bg-white">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-navy">Edit Tuition</h3>
            <p className="text-sm text-slate-500">Update the details of your post.</p>
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

        <TuitionForm
          key={tuition._id}
          initialValues={{
            subject: tuition.subject,
            classLevel: tuition.classLevel,
            location: tuition.location,
            budget: tuition.budget,
            daysPerWeek: tuition.daysPerWeek,
            description: tuition.description || "",
          }}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save Changes"
          onCancel={onClose}
        />
      </div>
      <div className="modal-backdrop bg-black/40" onClick={onClose} />
    </div>
  );
};

export default TuitionFormModal;