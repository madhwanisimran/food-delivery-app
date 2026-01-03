import api from "./axiosInstance";

const API_URL = "/user";
const userService = {
  // Admin: promote a user to admin
  promoteUser: async (userId, email) => {
    try {
      const response = await api.post(`${API_URL}/admin/promote`, {
        userId,
        email,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to promote user",
      };
    }
  },

  // Admin: list all users
  listUsers: async () => {
    try {
      const response = await api.get(`${API_URL}/admin/list`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch users",
      };
    }
  },
};

export default userService;
