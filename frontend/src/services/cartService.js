import api from "./axiosInstance";

const API_BASE = "/cart";

const cartService = {
  // Add item to cart (itemId required)
  addToCart: async (itemId) => {
    try {
      const response = await api.post(`${API_BASE}/add`, { itemId });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      console.error("cartService.addToCart error", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },

  // Remove item from cart (decrement or delete)
  removeFromCart: async (itemId) => {
    try {
      const response = await api.post(`${API_BASE}/remove`, { itemId });
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      console.error("cartService.removeFromCart error", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },

  // Get user'\''s cart data
  getCart: async () => {
    try {
      const response = await api.post(`${API_BASE}/get`, {});
      if (response.data.success) {
        return { success: true, cartData: response.data.cartData || {} };
      }
      return { success: false, message: "Failed to fetch cart" };
    } catch (error) {
      console.error("cartService.getCart error", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  },
};

export default cartService;
