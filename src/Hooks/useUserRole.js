import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

/**
 * Fetches the signed-in user's role ("student" | "tutor" | "admin") from the API.
 * Returns { role, roleLoading } so guards can wait before deciding.
 */
const useUserRole = () => {
  const { user, authLoading, saveUserToDb } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // wait for Firebase & initial JWT to settle

    if (!user?.email) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    let cancelled = false;
    setRoleLoading(true);

    const fetchRole = async () => {
      try {
        const { data } = await axiosSecure.get(
          `/users/role/${encodeURIComponent(user.email)}`
        );
        if (!cancelled) {
          setRole(data?.role || "student");
        }
      } catch (err) {
        // If the user hasn't been inserted into MongoDB yet (404), sync once and retry
        if (err?.response?.status === 404 && typeof saveUserToDb === "function") {
          try {
            await saveUserToDb({
              email: user.email,
              name: user.displayName || "",
              photoUrl: user.photoURL || "",
              role: "student",
            });
            const { data } = await axiosSecure.get(
              `/users/role/${encodeURIComponent(user.email)}`
            );
            if (!cancelled) {
              setRole(data?.role || "student");
              return;
            }
          } catch {
            // fall through to null
          }
        }

        if (!cancelled) {
          setRole(null);
        }
      } finally {
        if (!cancelled) {
          setRoleLoading(false);
        }
      }
    };

    fetchRole();

    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.displayName, user?.photoURL, authLoading, axiosSecure, saveUserToDb]);

  return { role, roleLoading };
};

export default useUserRole;