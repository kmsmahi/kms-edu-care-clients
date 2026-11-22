import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";

const FIREBASE_ERROR_MESSAGES = {
  "auth/invalid-credential": "Invalid email or password.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/popup-closed-by-user": "The sign-in window was closed.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

const authErrorMessage = (error) => {
  if (error?.code && FIREBASE_ERROR_MESSAGES[error.code]) {
    return FIREBASE_ERROR_MESSAGES[error.code];
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};

const LoginPage = () => {
  const { user, authLoading, loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && user && !submitting) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginUser(form.email.trim().toLowerCase(), form.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      const res = await googleLogin();
      if (res) {
        toast.success("Signed in with Google!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(authErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <section className="flex items-center justify-center px-4 py-14">
      <div className="card-surface w-full max-w-md p-8">
        <h1 className="text-center text-3xl font-extrabold text-navy">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Log in to manage your tuitions and applications.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                className="input w-full pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <MdVisibilityOff className="h-5 w-5" />
                ) : (
                  <MdVisibility className="h-5 w-5" />
                )}
              </button>
            </div>
          </label>

          <button type="submit" disabled={submitting} className="btn-brand h-12 w-full">
            {submitting ? <span className="loading loading-spinner loading-sm" /> : "Login"}
          </button>
        </form>

        <div className="divider text-xs text-slate-400">OR</div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="btn h-12 w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        >
          <FcGoogle className="h-5 w-5" /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          New to KMS EduCare?{" "}
          <Link to="/register" className="font-semibold text-teal hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;