import { useState } from "react";
import { Outlet } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";
import DashboardSidebar from "../Components/Dashboard/DashboardSidebar";
import DashboardTopbar from "../Components/Dashboard/DashboardTopbar";
import LoadingSpinner from "../Components/Shared/LoadingSpinner";

/**
 * Separate responsive shell for all dashboard pages (never used for public pages).
 * Large screens: fixed sidebar. Small screens: slide-in drawer.
 */
const DashboardLayout = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (roleLoading) {
    return <LoadingSpinner fullScreen label="Preparing your dashboard..." />;
  }

  return (
    <div className="drawer bg-surface lg:drawer-open">
      <input
        id="dashboard-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
      />

      {/* Main column */}
      <div className="drawer-content flex min-h-screen flex-col">
        <DashboardTopbar user={user} role={role} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label
          htmlFor="dashboard-drawer"
          aria-label="Close sidebar"
          className="drawer-overlay"
        />
        <DashboardSidebar
          user={user}
          role={role}
          onNavigate={() => setDrawerOpen(false)}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;