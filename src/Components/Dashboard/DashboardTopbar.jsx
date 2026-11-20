import { Link, useLocation } from "react-router-dom";
import { MdHome, MdMenu } from "react-icons/md";

const titleMap = {
  "/dashboard": "Overview",
  "/dashboard/profile": "Profile Settings",
  "/dashboard/my-tuitions": "My Tuitions",
  "/dashboard/post-tuition": "Post a Tuition",
  "/dashboard/applied-tutors": "Applied Tutors",
  "/dashboard/payments": "Payment History",
  "/dashboard/my-applications": "My Applications",
  "/dashboard/ongoing-tuitions": "Ongoing Tuitions",
  "/dashboard/revenue": "Revenue History",
  "/dashboard/manage-users": "Manage Users",
  "/dashboard/manage-tuitions": "Manage Tuitions",
  "/dashboard/reports": "Reports & Analytics",
};

const getTitle = (pathname) => {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean.startsWith("/dashboard/checkout")) return "Checkout";
  return titleMap[clean] || "Dashboard";
};

const DashboardTopbar = ({ user, role, onMenuClick }) => {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Opens the sidebar drawer on small screens */}
        <button
          onClick={onMenuClick}
          className="btn btn-ghost btn-square lg:hidden"
          aria-label="Open sidebar"
        >
          <MdMenu className="h-6 w-6 text-navy" />
        </button>
        <h1 className="text-lg font-bold text-navy md:text-xl">{getTitle(pathname)}</h1>
      </div>

      <div className="flex items-center gap-3">
        {role && (
          <span className="hidden rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold capitalize text-teal sm:inline-block">
            {role}
          </span>
        )}
        <Link to="/" className="btn btn-ghost btn-sm hidden text-slate-600 sm:inline-flex">
          <MdHome className="h-4 w-4" /> Website
        </Link>
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-teal bg-navy text-sm font-semibold text-white">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "Profile"}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            (user?.displayName || user?.email || "U").charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;