import api from "./axiosInstance";

const API_BASE = "/order";

const orderService = {
  placeOrder: async ({ items, amount, address, paymentMethod = "cod" }) => {
    try {
      const res = await api.post(`${API_BASE}/place`, {
        items,
        amount,
        address,
        paymentMethod,
      });
      return res.data;
    } catch (err) {
      console.error("orderService.placeOrder error", err);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },

  getOrder: async (orderId) => {
    try {
      const res = await api.get(`${API_BASE}/${orderId}`);
      return res.data;
    } catch (err) {
      console.error("orderService.getOrder error", err);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },
  verifyOrder: async (orderId, successFlag = true) => {
    try {
      const res = await api.post(`${API_BASE}/verify-order`, {
        orderId,
        success: !!successFlag,
      });
      return res.data;
    } catch (err) {
      console.error("orderService.verifyOrder error", err);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  },
};

export default orderService;
