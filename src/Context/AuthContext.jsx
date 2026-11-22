import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../Config/firebase.config";

export const AuthContext = createContext(null);

// localStorage key shared with useAxiosSecure
export const TOKEN_KEY = "kms-access-token";

const API_URL = String(import.meta.env.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");

const isMobileViewport = () => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth < 768 ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "")
  );
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [, setProfileTick] = useState(0);

  /* ------------------------------ JWT helpers ------------------------------ */

  const issueToken = useCallback(async (firebaseUser) => {
    if (!firebaseUser) return null;
    if (!API_URL) {
      throw new Error("VITE_API_BASE_URL is not configured");
    }
    const idToken = await firebaseUser.getIdToken(true);
    const { data } = await axios.post(`${API_URL}/auth/jwt`, {
      email: String(firebaseUser.email || "").trim().toLowerCase(),
      idToken,
    });
    if (data?.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data;
  }, []);

  const saveUserToDb = useCallback(async (profile) => {
    if (!API_URL) {
      throw new Error("VITE_API_BASE_URL is not configured");
    }
    const token = localStorage.getItem(TOKEN_KEY);
    const payload = {
      ...profile,
      email: String(profile?.email || "").trim().toLowerCase(),
    };
    const { data } = await axios.post(`${API_URL}/users`, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  }, []);

  /* ----------------------------- Auth actions ----------------------------- */

  const registerUser = useCallback(
    async (email, password) => {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await issueToken(credential.user);
      setUser(credential.user);
      return credential;
    },
    [issueToken]
  );

  const loginUser = useCallback(
    async (email, password) => {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await issueToken(credential.user);
      await saveUserToDb({
        email: credential.user.email,
        name: credential.user.displayName || "",
        photoUrl: credential.user.photoURL || "",
        role: "student",
      }).catch((err) => {
        console.error("Failed to sync user on login:", err);
      });
      setUser(credential.user);
      return credential;
    },
    [issueToken, saveUserToDb]
  );

  const googleLogin = useCallback(async () => {
    if (isMobileViewport()) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      await issueToken(credential.user);
      await saveUserToDb({
        name: credential.user.displayName || "",
        email: credential.user.email,
        photoUrl: credential.user.photoURL || "",
        role: "student",
      }).catch((err) => {
        console.error("Failed to sync Google user:", err);
      });
      setUser(credential.user);
      return credential;
    } catch (err) {
      if (
        err?.code === "auth/popup-blocked" ||
        err?.code === "auth/cancelled-popup-request"
      ) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw err;
    }
  }, [issueToken, saveUserToDb]);

  const updateUserProfile = useCallback(async (name, photoUrl) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoUrl,
    });
    setProfileTick((tick) => tick + 1);
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    return signOut(auth);
  }, []);

  /* ---------------- Observe auth state & mobile redirect result -------------- */

  useEffect(() => {
    let active = true;

    getRedirectResult(auth)
      .then(async (result) => {
        if (!active || !result?.user) return;
        await issueToken(result.user);
        await saveUserToDb({
          name: result.user.displayName || "",
          email: result.user.email,
          photoUrl: result.user.photoURL || "",
          role: "student",
        }).catch((err) => {
          console.error("Failed to sync redirect Google user:", err);
        });
      })
      .catch((err) => {
        console.error("Google redirect error:", err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;
      try {
        if (currentUser?.email) {
          await issueToken(currentUser);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (error) {
        console.error("JWT fetch failed:", error);
      } finally {
        if (active) {
          setUser(currentUser);
          setAuthLoading(false);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [issueToken, saveUserToDb]);

  const authInfo = {
    user,
    authLoading,
    registerUser,
    loginUser,
    googleLogin,
    updateUserProfile,
    logoutUser,
    saveUserToDb,
    issueToken,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;