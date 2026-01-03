import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      `mongodb+srv://madhwanisimran146_db_user:ikonkarsatnam@cluster0.z8xg0wx.mongodb.net/food_delivery`
    )
    .then(() => {
      console.log("MongoDB connected");
    });
};
