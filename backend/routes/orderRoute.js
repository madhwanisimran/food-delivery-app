import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminMiddleware from "../middleware/admin.js";
import {
  placeOrder,
  getOrder,
  verifyOrder,
  listOrders,
  updateOrderStatus,
  getUserOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);

orderRouter.post("/verify-order", authMiddleware, verifyOrder);
orderRouter.get("/list", authMiddleware, adminMiddleware, listOrders);
orderRouter.get("/my-orders", authMiddleware, getUserOrders);
orderRouter.post(
  "/update-status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);
orderRouter.get("/:id", authMiddleware, getOrder);
export default orderRouter;
