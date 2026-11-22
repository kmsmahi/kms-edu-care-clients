import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { TOKEN_KEY } from "../Context/AuthContext";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useUserRole = () => {
  const { user, authLoading, saveUserToDb, issueToken } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const userEmail = user?.email ? String(user.email).trim().toLowerCase() : "";
  const displayName = user?.displayName || "";
  const photoURL = user?.photoURL || "";

  useEffect(() => {
    if (authLoading) return;

    if (!userEmail) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    let cancelled = false;
    setRoleLoading(true);

    const fetchRole = async () => {
      try {
        // Wait briefly if token hasn't hit localStorage yet on mobile
        if (!localStorage.getItem(TOKEN_KEY) && typeof issueToken === "function" && user) {
          await issueToken(user).catch(() => {});
          await sleep(120);
        }

        const { data } = await axiosSecure.get(
          `/users/role/${encodeURIComponent(userEmail)}`
        );
        if (!cancelled) {
          setRole(data?.role || "student");
        }
      } catch (err) {
        if (err?.response?.status === 404 && typeof saveUserToDb === "function") {
          try {
            await saveUserToDb({
              email: userEmail,
              name: displayName,
              photoUrl: photoURL,
              role: "student",
            });
            const { data } = await axiosSecure.get(
              `/users/role/${encodeURIComponent(userEmail)}`
            );
            if (!cancelled) {
              setRole(data?.role || "student");
              return;
            }
          } catch {
            // fall through
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
  }, [userEmail, displayName, photoURL, authLoading, axiosSecure, saveUserToDb, issueToken, user]);

  return { role, roleLoading };
};

export default useUserRole;