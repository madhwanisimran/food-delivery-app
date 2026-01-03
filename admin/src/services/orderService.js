import api from "./axiosInstance";

const API_URL = "/order";

const orderService = {
  // Get all orders (admin only). Accept optional token to send explicitly.
  listOrders: async (token) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined;
      const response = await api.get(`${API_URL}/list`, config);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch orders",
      };
    }
  },

  // Get single order
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`${API_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch order",
      };
    }
  },

  // Verify/update order status
  verifyOrder: async (orderId, status) => {
    try {
      const response = await api.post(`${API_URL}/verify-order`, {
        orderId,
        status,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update order",
      };
    }
  },

  // Update order status (for order tracking)
  updateOrderStatus: async (orderId, orderStatus) => {
    try {
      const response = await api.post(`${API_URL}/update-status`, {
        orderId,
        orderStatus,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to update order status",
      };
    }
  },
};

export default orderService;
