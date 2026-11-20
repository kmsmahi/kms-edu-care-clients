import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/shared/LoadingSpinner";

/**
 * Blocks unauthenticated access.
 * Waits for authLoading to finish BEFORE checking `user`, so reloading a
 * protected page never bounces a logged-in user to /login.
 */
const PrivateRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <LoadingSpinner fullScreen />;

  if (!user) {
    // Remember the intended destination so login can send the user back
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;