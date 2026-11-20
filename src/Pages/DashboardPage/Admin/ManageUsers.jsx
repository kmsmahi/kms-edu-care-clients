import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdClose, MdDeleteOutline, MdEdit, MdSearch } from "react-icons/md";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

const ROLES = ["student", "tutor", "admin"];

/** Edit a user's basic details (email and role are not edited here). */
const EditUserModal = ({ target, onClose, onSaved }) => {
  const axiosSecure = useAxiosSecure();
  const [form, setForm] = useState({
    name: target.name || "",
    phone: target.phone || "",
    photoUrl: target.photoUrl || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Please enter a valid name.");
    if (form.phone.trim() && !/^\+?[0-9]{10,15}$/.test(form.phone.replace(/[\s-]/g, "")))
      return toast.error("Please enter a valid phone number.");
    if (form.photoUrl.trim() && !/^https?:\/\/\S+$/i.test(form.photoUrl.trim()))
      return toast.error("Photo URL must start with http:// or https://");

    const values = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      photoUrl: form.photoUrl.trim(),
    };

    setSaving(true);
    try {
      await axiosSecure.patch(`/admin/users/${target._id}`, values);
      toast.success("User updated");
      onSaved({ ...target, ...values });
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update the user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true">
      <div className="modal-box max-w-lg bg-white">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-navy">Edit user</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle" aria-label="Close">
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input readOnly value={target.email} className="input w-full cursor-not-allowed bg-slate-100" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Full name</span>
            <input name="name" value={form.name} onChange={handleChange} className="input w-full" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Phone</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+8801XXXXXXXXX"
              className="input w-full"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Photo URL</span>
            <input
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="input w-full"
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

const ManageUsers = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/admin/users")
      .then(({ data }) => !cancelled && setUsers(Array.isArray(data) ? data : []))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = !roleFilter || u.role === roleFilter;
      const matchesText =
        !term ||
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term);
      return matchesRole && matchesText;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = async (target, role) => {
    if (role === target.role) return;

    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: "Change role?",
      text: `${target.name || target.email} will become a ${role}.`,
      showCancelButton: true,
      confirmButtonColor: "#0F294A",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, change it",
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.patch(`/admin/users/${target._id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u._id === target._id ? { ...u, role } : u)));
      toast.success("Role updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not change the role.");
    }
  };

  const handleDelete = async (target) => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "Delete this account?",
      text: `${target.name || target.email} will be permanently removed.`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });
    if (!isConfirmed) return;

    try {
      await axiosSecure.delete(`/admin/users/${target._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== target._id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete the user.");
    }
  };

  const handleSaved = (updated) =>
    setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));

  if (loading) return <LoadingSpinner label="Loading users..." />;

  if (error)
    return (
      <div className="card-surface p-10 text-center text-slate-500">
        Could not load users. Please try again later.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Search + role filter */}
      <div className="card-surface grid gap-3 p-4 sm:grid-cols-3">
        <label className="input w-full sm:col-span-2">
          <MdSearch className="h-5 w-5 text-slate-400" />
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="select w-full capitalize"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-500">
        Showing {visible.length} of {users.length} users
      </p>

      <div className="card-surface overflow-x-auto">
        <table className="table">
          <thead className="bg-surface text-navy">
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-500">
                  No users match your filters.
                </td>
              </tr>
            ) : (
              visible.map((u) => {
                const isSelf = u.email === user?.email;
                return (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-sm font-semibold text-white">
                          {u.photoUrl ? (
                            <img
                              src={u.photoUrl}
                              alt={u.name}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            (u.name || u.email || "U").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy">
                            {u.name || "Unnamed"}
                            {isSelf && <span className="ml-2 text-xs text-teal">(you)</span>}
                          </p>
                          <p className="truncate text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{u.phone || "-"}</td>
                    <td>
                      <select
                        className="select select-sm w-32 capitalize"
                        value={u.role}
                        disabled={isSelf}
                        title={isSelf ? "You cannot change your own role" : "Change role"}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB") : "-"}
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditing(u)}
                          className="btn btn-sm btn-square btn-ghost text-teal"
                          aria-label="Edit user"
                          title="Edit"
                        >
                          <MdEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={isSelf}
                          className="btn btn-sm btn-square btn-ghost text-red-500"
                          aria-label="Delete user"
                          title={isSelf ? "You cannot delete yourself" : "Delete"}
                        >
                          <MdDeleteOutline className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditUserModal target={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
      )}
    </div>
  );
};

export default ManageUsers;