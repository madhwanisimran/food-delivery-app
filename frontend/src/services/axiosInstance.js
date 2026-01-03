import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  timeout: 15000,
});

instance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (res) => {
    if (res.data?.forceLogout === true) {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch {
        // ignore
      }
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return res;
  },
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch {
        // ignore
      }
      if (typeof window !== "undefined") window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default instance;
