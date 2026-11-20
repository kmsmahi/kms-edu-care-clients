import { createContext, useEffect, useState } from "react";
import axios from "axios"; 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../Config/firebase.config";

export const AuthContext = createContext(null);

// localStorage key shared with useAxiosSecure
export const TOKEN_KEY = "kms-access-token";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // True only until Firebase reports the initial auth state and the JWT is ready.
  // PrivateRoute waits on this, so a page reload never redirects to /login.
  const [authLoading, setAuthLoading] = useState(true);
  // Bumped after profile updates so consumers re-render with fresh values
  const [, setProfileTick] = useState(0);

  /* ------------------------------ JWT helpers ------------------------------ */

  /** Exchange a verified Firebase user's email for a backend-signed JWT. */
  const issueToken = async (email) => {
    const { data } = await axios.post(`${API_URL}/auth/jwt`, { email });
    localStorage.setItem(TOKEN_KEY, data.token);
  };

  /** Create the user document in MongoDB (backend upserts, never overwrites role). */
  const saveUserToDb = (profile) =>
    axios.post(`${API_URL}/users`, profile).catch((err) => {
      console.error("Failed to sync user:", err);
    });

  /* ----------------------------- Auth actions ----------------------------- */
  // Each action stores the JWT and sets `user` before resolving, so navigating
  // to a private route right after login can never race the auth listener.

  const registerUser = async (email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await issueToken(credential.user.email);
    setUser(credential.user);
    return credential;
  };

  const loginUser = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await issueToken(credential.user.email);
    setUser(credential.user);
    return credential;
  };

  /** Google login. New Google users are saved with the default role "student". */
  const googleLogin = async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    await saveUserToDb({
      name: credential.user.displayName,
      email: credential.user.email,
      photoUrl: credential.user.photoURL,
      role: "student",
    });
    await issueToken(credential.user.email);
    setUser(credential.user);
    return credential;
  };

  const updateUserProfile = async (name, photoUrl) => {
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoUrl,
    });
    // auth.currentUser is mutated in place; bump state to re-render consumers
    setProfileTick((tick) => tick + 1);
  };

  const logoutUser = () => {
    localStorage.removeItem(TOKEN_KEY);
    return signOut(auth);
  };

  /* --------------------- Observe auth state (reload persistence) --------------------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser?.email) {
          await issueToken(currentUser.email);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (error) {
        console.error("JWT fetch failed:", error);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setUser(currentUser);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    authLoading,
    registerUser,
    loginUser,
    googleLogin,
    updateUserProfile,
    logoutUser,
    saveUserToDb,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;