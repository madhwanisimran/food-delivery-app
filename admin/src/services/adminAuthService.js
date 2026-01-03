import api from "./axiosInstance";

const API_URL = "/user";

const adminAuthService = {
  // Login admin
  login: async (email, password) => {
    try {
      const response = await api.post(`${API_URL}/login`, { email, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        if (response.data.user) {
          localStorage.setItem("adminUser", JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("adminToken");
  },

  // Get stored admin user
  getAdmin: () => {
    const admin = localStorage.getItem("adminUser");
    return admin ? JSON.parse(admin) : null;
  },

  // Check if admin is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("adminToken");
  },
};

export default adminAuthService;
