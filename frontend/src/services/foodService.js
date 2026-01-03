import axios from "axios";

const API_BASE = "http://localhost:4000/api/food";

const buildImageUrl = (filename) => {
  if (!filename) return null;
  return `http://localhost:4000/uploads/${filename}`;
};

const foodService = {
  getFoods: async () => {
    try {
      const res = await axios.get(`${API_BASE}/list`);
      if (res.data && res.data.success) {
        const foods = (res.data.foods || []).map((f) => ({
          id: f._id || f.id,
          name: f.name,
          description: f.description,
          category: f.category,
          price: f.price,
          image: f.image ? buildImageUrl(f.image) : f.img || null,
          rating: f.rating || 4.5,
          restaurant: f.restaurant || f.vendor || "",
        }));
        return { success: true, foods };
      }
      return {
        success: false,
        message: res.data?.message || "Failed to load foods",
      };
    } catch (err) {
      console.error("foodService.getFoods error", err);
      return { success: false, message: err.message || "Network error" };
    }
  },
};

export default foodService;
