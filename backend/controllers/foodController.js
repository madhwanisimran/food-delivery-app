import foodModel from "../models/foodModel.js";
import cloudinary from "../config/cloudinary.js";

//upload image buffer to cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "food_delivery/foods" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(buffer);
  });
};

// add food item
const addFood = async (req, res) => {
  let image_url = null;
  let image_public_id = null;

  const { name, description, price, category, image } = req.body;

  // Upload image to Cloudinary
  if (req.file) {
    // From multipart/form-data
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      image_url = result.secure_url;
      image_public_id = result.public_id;
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }
  } else if (image && typeof image === "string") {
    // From JSON with base64
    try {
      const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const result = await uploadToCloudinary(buffer);
      image_url = result.secure_url;
      image_public_id = result.public_id;
    } catch (error) {
      console.error("Error uploading image to Cloudinary", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }
  }

  if (!name || !description || !price || !category) {
    if (image_public_id) {
      try {
        await cloudinary.uploader.destroy(image_public_id);
      } catch (e) {
        console.error(
          "Failed to remove uploaded file from Cloudinary after validation error",
          e
        );
      }
    }
    return res.status(400).json({
      success: false,
      message: "Missing required fields: name, description, price, category",
    });
  }

  const priceNum = Number(price);
  if (Number.isNaN(priceNum) || priceNum < 0) {
    if (image_public_id) {
      try {
        await cloudinary.uploader.destroy(image_public_id);
      } catch (e) {
        console.error("Failed to remove file from Cloudinary", e);
      }
    }
    return res
      .status(400)
      .json({ success: false, message: "Price must be a non-negative number" });
  }

  const food = new foodModel({
    name: String(name).trim(),
    description: String(description).trim(),
    price: priceNum,
    image: image_url,
    image_public_id: image_public_id,
    category: String(category).trim(),
  });

  try {
    await food.save();
    return res
      .status(201)
      .json({ success: true, message: "Food item added", item: food });
  } catch (error) {
    console.error("Error saving food item", error);
    if (image_public_id) {
      try {
        await cloudinary.uploader.destroy(image_public_id);
      } catch (e) {
        console.error("Failed to remove uploaded file from Cloudinary", e);
      }
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel
      .find({})
      .select("name price image category")
      .limit(20);
    return res.status(200).json({ success: true, foods });
  } catch (error) {
    console.error("Error fetching food items", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const id = req.params?.id || req.body?.id;
    if (!id)
      return res.status(400).json({ success: false, message: "Missing id" });

    const food = await foodModel.findById(id);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });

    // Delete image from Cloudinary
    if (food.image_public_id) {
      try {
        await cloudinary.uploader.destroy(food.image_public_id);
      } catch (e) {
        console.error("Failed to remove food image from Cloudinary", e);
      }
    }

    await foodModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Food item removed" });
  } catch (error) {
    console.error("Error removing food item", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { addFood, listFood, removeFood };
