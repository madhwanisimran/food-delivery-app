import axios from "axios";

// Create axios instance with base URL
const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 15000,
});

// Request interceptor - attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor - handle 401
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      // Clear admin token and redirect to login
      try {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      } catch {
        // ignore
      }
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
