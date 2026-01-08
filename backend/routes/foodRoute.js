import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";
import upload from "../config/multer.js";
import adminMiddleware from "../middleware/admin.js";

const foodRouter = express.Router();

foodRouter.post("/add", adminMiddleware, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", adminMiddleware, removeFood);
foodRouter.post("/delete", adminMiddleware, removeFood);
foodRouter.delete("/:id", adminMiddleware, removeFood);

export default foodRouter;
