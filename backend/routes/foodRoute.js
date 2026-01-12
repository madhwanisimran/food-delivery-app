import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";
import upload from "../config/multer.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const foodRouter = express.Router();

foodRouter.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addFood
);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", authMiddleware, adminMiddleware, removeFood);
foodRouter.post("/delete", authMiddleware, adminMiddleware, removeFood);
foodRouter.delete("/:id", authMiddleware, adminMiddleware, removeFood);

export default foodRouter;
