import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdSave } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

/** Update name, phone and photo URL. Email and role are read-only. */
const ProfileSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const [form, setForm] = useState({
    name: user?.displayName || "",
    phone: "",
    photoUrl: user?.photoURL || "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load the saved profile (phone lives in MongoDB, not Firebase)
  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/users/me")
      .then(({ data }) => {
        if (cancelled) return;
        setForm({
          name: data?.name || user?.displayName || "",
          phone: data?.phone || "",
          photoUrl: data?.photoUrl || user?.photoURL || "",
        });
      })
      .catch(() => {}) // fall back to Firebase values
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure, user?.email]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (form.name.trim().length < 2) return "Please enter your full name.";
    if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/[\s-]/g, "")))
      return "Please enter a valid phone number.";
    if (form.photoUrl.trim() && !/^https?:\/\/\S+$/i.test(form.photoUrl.trim()))
      return "Photo URL must start with http:// or https://";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return toast.error(problem);

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      photoUrl: form.photoUrl.trim(),
    };

    setSaving(true);
    try {
      await axiosSecure.patch("/users/profile", payload);
      await updateUserProfile(payload.name, payload.photoUrl || null); // keep Firebase in sync
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="card-surface p-6 md:p-8">
        {/* Avatar preview */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-teal/20 bg-navy text-2xl font-bold text-white">
            {form.photoUrl ? (
              <img
                src={form.photoUrl}
                alt="Profile preview"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              (form.name || user?.email || "U").charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">{form.name || "Your profile"}</h2>
            {role && (
              <span className="mt-1 inline-block rounded-full bg-teal/10 px-3 py-0.5 text-xs font-semibold capitalize text-teal">
                {role}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Full name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Phone</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+8801XXXXXXXXX"
              className="input w-full"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="input w-full cursor-not-allowed bg-slate-100"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Photo URL <span className="text-slate-400">(optional)</span>
            </span>
            <input
              type="url"
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              placeholder="https://example.com/your-photo.jpg"
              className="input w-full"
            />
          </label>
        </div>

        <div className="mt-8 flex justify-end">
          <button type="submit" disabled={saving} className="btn-brand h-12 px-8">
            {saving ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <MdSave className="h-5 w-5" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;