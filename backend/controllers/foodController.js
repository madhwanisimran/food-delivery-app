import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// add food item
const addFood = async (req, res) => {
  const file = req.file;
  const image_filename = file ? file.filename : null;

  const { name, description, price, category } = req.body || {};
  if (!name || !description || !price || !category) {
    if (file) {
      try {
        fs.unlinkSync(path.resolve(process.cwd(), "uploads", file.filename));
      } catch (e) {
        console.error(
          "Failed to remove uploaded file after validation error",
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
    if (file) {
      try {
        fs.unlinkSync(path.resolve(process.cwd(), "uploads", file.filename));
      } catch (e) {}
    }
    return res
      .status(400)
      .json({ success: false, message: "Price must be a non-negative number" });
  }

  const food = new foodModel({
    name: String(name).trim(),
    description: String(description).trim(),
    price: priceNum,
    image: image_filename,
    category: String(category).trim(),
  });

  try {
    await food.save();
    return res
      .status(201)
      .json({ success: true, message: "Food item added", item: food });
  } catch (error) {
    console.error("Error saving food item", error);
    if (file) {
      try {
        fs.unlinkSync(path.resolve(process.cwd(), "uploads", file.filename));
      } catch (e) {
        console.error("Failed to remove uploaded file after save error", e);
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
    const foods = await foodModel.find({});
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
    if (food.image) {
      try {
        const imgPath = path.resolve(
          process.cwd(),
          "uploads",
          String(food.image)
        );
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      } catch (e) {
        console.error("Failed to remove food image file", e);
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
