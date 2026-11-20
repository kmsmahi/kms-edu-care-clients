import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import LoadingSpinner from "../components/shared/LoadingSpinner";

/**
 * Restricts a route to specific roles, e.g.
 *   <RoleRoute allowedRoles={["admin"]}><ManageUsers /></RoleRoute>
 * This is the UI layer only; the API enforces roles via JWT verification.
 */
const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, authLoading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (authLoading || roleLoading) return <LoadingSpinner fullScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    // Signed in but not permitted → neutral dashboard home
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;