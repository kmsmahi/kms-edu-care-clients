import { useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";
import { TOKEN_KEY } from "../Context/AuthContext";

const BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "")
  .trim()
  .replace(/\/+$/, "");

const useAxiosSecure = () => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const axiosSecure = useMemo(
    () => axios.create({ baseURL: BASE_URL }),
    []
  );

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
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

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosSecure, logoutUser, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;