import { useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";
import { TOKEN_KEY } from "../Context/AuthContext";

/**
 * Axios instance that attaches the JWT to every request and logs the user
 * out on 401/403 responses (expired or invalid token).
 */
const useAxiosSecure = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const axiosSecure = useMemo(
    () => axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL }),
    []
  );

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          await logoutUser();
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    // Eject on cleanup so interceptors never stack up
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosSecure, logoutUser, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;