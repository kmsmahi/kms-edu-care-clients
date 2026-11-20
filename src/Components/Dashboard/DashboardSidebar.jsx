import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  MdAddCircleOutline,
  MdAssignment,
  MdAttachMoney,
  MdDashboard,
  MdFactCheck,
  MdHome,
  MdInsights,
  MdLogout,
  MdManageAccounts,
  MdMenuBook,
  MdPeopleAlt,
  MdReceiptLong,
  MdSchool,
  MdSettings,
} from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/logo.png";

const overview = [{ label: "Overview", to: "/dashboard", Icon: MdDashboard, end: true }];

// Role-aware navigation (paths match router.jsx)
const roleLinks = {
  student: [
    { label: "My Tuitions", to: "/dashboard/my-tuitions", Icon: MdMenuBook },
    { label: "Post Tuition", to: "/dashboard/post-tuition", Icon: MdAddCircleOutline },
    { label: "Applied Tutors", to: "/dashboard/applied-tutors", Icon: MdPeopleAlt },
    { label: "Payments", to: "/dashboard/payments", Icon: MdReceiptLong },
  ],
  tutor: [
    { label: "My Applications", to: "/dashboard/my-applications", Icon: MdAssignment },
    { label: "Ongoing Tuitions", to: "/dashboard/ongoing-tuitions", Icon: MdSchool },
    { label: "Revenue History", to: "/dashboard/revenue", Icon: MdAttachMoney },
  ],
  admin: [
    { label: "Manage Users", to: "/dashboard/manage-users", Icon: MdManageAccounts },
    { label: "Manage Tuitions", to: "/dashboard/manage-tuitions", Icon: MdFactCheck },
    { label: "Reports & Analytics", to: "/dashboard/reports", Icon: MdInsights },
  ],
};

const settings = [
  { label: "Profile Settings", to: "/dashboard/profile", Icon: MdSettings },
];

const DashboardSidebar = ({ user, role, onNavigate }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const links = [...overview, ...(roleLinks[role] || []), ...settings];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-teal text-white"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  };

  return (
    <aside className="flex min-h-full w-72 flex-col bg-navy p-4 text-white">
      {/* Brand */}
      <Link to="/" onClick={onNavigate} className="mb-6 flex items-center gap-2 px-2 pt-2">
        <img src={logo} alt="KMS EduCare" className="h-9 w-9 rounded-md bg-white object-contain p-1" />
        <span className="text-lg font-extrabold">
          KMS <span className="text-teal">EduCare</span>
        </span>
      </Link>

      {/* User profile block */}
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-white/10 p-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-teal bg-white/20 text-lg font-bold">
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
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user?.displayName || "KMS User"}</p>
          <p className="truncate text-xs text-slate-300">{user?.email}</p>
          {role && (
            <span className="mt-1 inline-block rounded-full bg-teal px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              {role}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {links.map(({ label, to, Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={linkClass} onClick={onNavigate}>
                <Icon className="h-5 w-5" /> {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="mt-6 space-y-1 border-t border-white/10 pt-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <MdHome className="h-5 w-5" /> Back to Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/10"
        >
          <MdLogout className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;