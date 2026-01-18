import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  image_public_id: { type: String }, // Cloudinary public ID for deletion
  category: { type: String, required: true },
  restaurantName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 4.5 },
  createdAt: { type: Date, default: Date.now },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
