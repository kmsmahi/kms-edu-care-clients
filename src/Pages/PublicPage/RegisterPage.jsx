import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { MdSchool, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const authErrorMessage = (code) =>
  ({
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password is too weak.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/popup-closed-by-user": "The sign-in window was closed.",
    "auth/network-request-failed": "Network error. Check your connection.",
  })[code] || "Something went wrong. Please try again.";

const roles = [
  { value: "student", label: "Student", hint: "Post tuitions", Icon: MdSchool },
  { value: "tutor", label: "Tutor", hint: "Apply & teach", Icon: FaChalkboardTeacher },
];

const RegisterPage = () => {
  const { user, authLoading, registerUser, updateUserProfile, saveUserToDb, googleLogin } =
    useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && user && !submitting) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /** Returns an error string, or null when the form is valid. */
  const validate = () => {
    if (form.name.trim().length < 2) return "Please enter your full name.";
    if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/[\s-]/g, "")))
      return "Please enter a valid phone number.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(form.password)) return "Password needs an uppercase letter.";
    if (!/[a-z]/.test(form.password)) return "Password needs a lowercase letter.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const problem = validate();
    if (problem) return toast.error(problem);

    setSubmitting(true);
    try {
      const name = form.name.trim();
      const email = form.email.trim();

      await registerUser(email, form.password);
      await updateUserProfile(name, "");
      // Save profile (including phone + role) to MongoDB through the API
      await saveUserToDb({
        name,
        email,
        phone: form.phone.trim(),
        role: form.role,
        photoUrl: "",
      });

      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(authErrorMessage(error.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      await googleLogin(); // new Google users are saved as "student"
      toast.success("Signed in with Google!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(authErrorMessage(error.code));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center px-4 py-14">
      <div className="card-surface w-full max-w-lg p-8">
        <h1 className="text-center text-3xl font-extrabold text-navy">Create your account</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Join KMS EduCare as a student or a tutor.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Role picker */}
          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700">I am a</span>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(({ value, label, hint, Icon }) => {
                const active = form.role === value;
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors ${
                      active ? "border-teal bg-teal/5" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={active}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        active ? "bg-teal text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{label}</p>
                      <p className="text-xs text-slate-500">{hint}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Full name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="input w-full"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
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
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 chars, upper & lower case"
                className="input w-full pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
              </button>
            </div>
          </label>

          <button type="submit" disabled={submitting} className="btn-brand h-12 w-full">
            {submitting ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
          </button>
        </form>

        <div className="divider text-xs text-slate-400">OR</div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="btn h-12 w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        >
          <FcGoogle className="h-5 w-5" /> Sign up with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-teal hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;