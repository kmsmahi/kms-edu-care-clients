import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  MdAssignment,
  MdAttachMoney,
  MdFactCheck,
  MdHourglassBottom,
  MdMenuBook,
  MdPeopleAlt,
  MdSchool,
  MdGroups,
} from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import useUserRole from "../../../Hooks/useUserRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/Shared/LoadingSpinner";
import StatsCard, { formatMoney } from "../../../Components/Dashboard/StatsCard";

// Which metrics and shortcuts each role sees
const roleConfig = {
  student: {
    stats: [
      { key: "totalTuitions", title: "My Tuitions", Icon: MdMenuBook, tone: "navy" },
      { key: "pendingTuitions", title: "Pending Approval", Icon: MdHourglassBottom, tone: "amber" },
      { key: "totalApplicants", title: "Total Applicants", Icon: MdPeopleAlt, tone: "teal" },
      { key: "totalPaid", title: "Total Paid", Icon: MdAttachMoney, tone: "green", money: true },
    ],
    actions: [
      { label: "Post a Tuition", to: "/dashboard/post-tuition" },
      { label: "Review Applicants", to: "/dashboard/applied-tutors" },
      { label: "Payment History", to: "/dashboard/payments" },
    ],
  },
  tutor: {
    stats: [
      { key: "totalApplications", title: "Applications", Icon: MdAssignment, tone: "navy" },
      { key: "pendingApplications", title: "Pending", Icon: MdHourglassBottom, tone: "amber" },
      { key: "ongoingTuitions", title: "Ongoing Tuitions", Icon: MdSchool, tone: "teal" },
      { key: "totalEarnings", title: "Total Earnings", Icon: MdAttachMoney, tone: "green", money: true },
    ],
    actions: [
      { label: "Find Tuitions", to: "/tuitions" },
      { label: "My Applications", to: "/dashboard/my-applications" },
      { label: "Revenue History", to: "/dashboard/revenue" },
    ],
  },
  admin: {
    stats: [
      { key: "totalUsers", title: "Total Users", Icon: MdGroups, tone: "navy" },
      { key: "totalTuitions", title: "Tuition Posts", Icon: MdMenuBook, tone: "teal" },
      { key: "pendingTuitions", title: "Awaiting Review", Icon: MdFactCheck, tone: "amber" },
      { key: "totalEarnings", title: "Platform Earnings", Icon: MdAttachMoney, tone: "green", money: true },
    ],
    actions: [
      { label: "Moderate Tuitions", to: "/dashboard/manage-tuitions" },
      { label: "Manage Users", to: "/dashboard/manage-users" },
      { label: "View Reports", to: "/dashboard/reports" },
    ],
  },
};

const DashboardHome = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roleLoading) return;
    if (!role) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    axiosSecure
      .get("/dashboard/stats")
      .then(({ data }) => !cancelled && setStats(data || {}))
      .catch(() => {}) // cards fall back to 0
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [role, roleLoading, axiosSecure]);

  if (roleLoading || loading) return <LoadingSpinner label="Loading overview..." />;

  const config = roleConfig[role];
  const firstName = (user?.displayName || "there").split(" ")[0];

  if (!config) {
    return (
      <div className="card-surface p-10 text-center text-slate-500">
        We could not determine your account role. Please log in again.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-navy p-6 text-white md:p-8">
        <p className="text-sm text-slate-300">Welcome back,</p>
        <h2 className="text-2xl font-extrabold md:text-3xl">{firstName}!</h2>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          Here is a quick snapshot of your {role} account on KMS EduCare.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {config.stats.map(({ key, title, Icon, tone, money }) => (
          <StatsCard
            key={key}
            title={title}
            Icon={Icon}
            tone={tone}
            value={money ? formatMoney(stats[key] || 0, stats.currency || "BDT") : stats[key] ?? 0}
          />
        ))}
      </div>

      {/* Shortcuts */}
      <div className="card-surface p-6">
        <h3 className="text-lg font-bold text-navy">Quick actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {config.actions.map(({ label, to }) => (
            <Link key={to} to={to} className="btn-brand-outline">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;