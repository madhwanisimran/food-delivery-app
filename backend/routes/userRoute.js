import express from "express";
import {
  loginUser,
  registeruser,
  promoteUser,
  listUsers,
  getCurrentUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";

const userRouter = express.Router();

userRouter.post("/register", registeruser);
userRouter.post("/login", loginUser);

// current user
userRouter.get("/me", authMiddleware, getCurrentUser);

// Admin routes
userRouter.post("/admin/promote", authMiddleware, adminMiddleware, promoteUser);
userRouter.get("/admin/list", authMiddleware, adminMiddleware, listUsers);

export default userRouter;
