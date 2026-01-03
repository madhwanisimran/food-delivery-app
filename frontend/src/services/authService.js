import api from "./axiosInstance";

const API_URL = "/user";

const authService = {
  // Register user
  register: async (name, email, password) => {
    try {
      const response = await api.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });
      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.user)
          localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post(`${API_URL}/login`, { email, password });
      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        if (response.data.user)
          localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Fetch current user from API using token
  fetchCurrentUser: async () => {
    try {
      const res = await api.get(`${API_URL}/me`);
      if (res.data?.success && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Failed to fetch user",
      };
    }
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },
};

export default authService;
