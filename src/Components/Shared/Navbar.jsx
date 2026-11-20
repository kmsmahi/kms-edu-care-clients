import { Link, NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FaGraduationCap } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdDashboard, MdLogout, MdPersonOutline } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Tuitions", to: "/tuitions" },
  { label: "Tutors", to: "/tutors" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** Closes any open DaisyUI focus-based dropdown after a click. */
const closeDropdown = () => document.activeElement?.blur();

const Navbar = () => {
  const { user, authLoading, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    closeDropdown();
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  };

  // Active link styling shared by desktop and mobile menus
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-teal/10 text-teal"
        : "text-slate-700 hover:bg-slate-100 hover:text-navy"
    }`;

  const links = navLinks.map((item) => (
    <li key={item.to}>
      <NavLink to={item.to} className={linkClass} onClick={closeDropdown} end={item.to === "/"}>
        {item.label}
      </NavLink>
    </li>
  ));

  // Uniform 40x40 avatar: photo if available, otherwise initial
  const avatar = (
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-teal bg-navy text-white">
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt={user.displayName || "Profile"}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-sm font-semibold">
          {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* ---------- Left: mobile menu + brand ---------- */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost px-2 lg:hidden" aria-label="Open menu">
              <HiMenuAlt3 className="h-6 w-6 text-navy" />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-10 mt-3 w-56 gap-1 rounded-box border border-slate-200 bg-white p-3 shadow-lg"
            >
              {links}
            </ul>
          </div>

          {/* Brand: icon badge, no image file required */}
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white">
              <FaGraduationCap className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-navy">
              KMS <span className="text-teal">EduCare</span>
            </span>
          </Link>
        </div>

        {/* ---------- Center: desktop links ---------- */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">{links}</ul>
        </div>

        {/* ---------- Right: auth area ---------- */}
        <div className="navbar-end gap-2">
          {authLoading ? (
            // Placeholder keeps layout stable while auth resolves
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            <>
              <Link to="/dashboard" className="btn-brand btn-sm hidden h-10 sm:inline-flex">
                <MdDashboard className="h-4 w-4" /> Dashboard
              </Link>

              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="rounded-full" aria-label="Profile menu">
                  {avatar}
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-10 mt-3 w-60 gap-1 rounded-box border border-slate-200 bg-white p-3 shadow-lg"
                >
                  <li className="pointer-events-none mb-1 border-b border-slate-100 pb-2">
                    <div className="flex flex-col items-start gap-0">
                      <span className="font-semibold text-navy">
                        {user.displayName || "KMS User"}
                      </span>
                      <span className="max-w-full truncate text-xs text-slate-500">
                        {user.email}
                      </span>
                    </div>
                  </li>
                  <li>
                    <Link to="/dashboard" onClick={closeDropdown}>
                      <MdDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/profile" onClick={closeDropdown}>
                      <MdPersonOutline className="h-4 w-4" /> Profile Settings
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-error">
                      <MdLogout className="h-4 w-4" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-brand-outline btn-sm h-10">
                Login
              </Link>
              <Link to="/register" className="btn-brand btn-sm h-10">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;