import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/** Convenience hook for consuming the auth context. */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};

export default useAuth;