import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

/**
 * Fetches the signed-in user's role ("student" | "tutor" | "admin") from the API.
 * Returns { role, roleLoading } so guards can wait before deciding.
 */
const useUserRole = () => {
  const { user, authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // wait for Firebase to settle

    if (!user?.email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    let cancelled = false;
    setRoleLoading(true);

    axiosSecure
      .get(`/users/role/${user.email}`)
      .then(({ data }) => {
        if (!cancelled) setRole(data?.role || "student");
      })
      .catch(() => {
        if (!cancelled) setRole(null);
      })
      .finally(() => {
        if (!cancelled) setRoleLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.email, authLoading, axiosSecure]);

  return { role, roleLoading };
};

export default useUserRole;