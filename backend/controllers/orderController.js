import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// POST /api/order/place - Creates order (simple backend, no PayPal)
const placeOrder = async (req, res) => {
  try {
    const userId = req.user && req.user.id ? req.user.id : req.body.userId;
    const {
      items = [],
      amount = 0,
      address = {},
      paymentMethod = "cod",
    } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Save order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Food Processing",
      paymentMethod,
    });
    await newOrder.save();

    // Clear user cart after order placed
    try {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    } catch (e) {
      console.warn("Failed to clear cart:", e.message);
    }

    return res.json({
      success: true,
      orderId: newOrder._id.toString(),
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error(
      "placeOrder error:",
      error && error.stack ? error.stack : error
    );
    return res
      .status(500)
      .json({ success: false, message: "Could not create order" });
  }
};

// GET /api/order/:id - Fetch order details
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error("getOrder error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "orderId required" });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    if (success === true) {
      order.payment = true;
      order.status = "Paid";
      await order.save();
      return res.json({
        success: true,
        message: "paid",
        orderId: order._id.toString(),
      });
    }
    if ((order.paymentMethod || "cod").toLowerCase() === "cod") {
      return res.json({
        success: true,
        message: "not paid",
        orderId: order._id.toString(),
      });
    }

    // order.payment = false;
    // order.status = "Payment Failed";
    // await order.save();
    // return res.json({
    //   success: false,
    //   message: "payment failed",
    //   orderId: order._id.toString(),
    // });
  } catch (error) {
    console.error(
      "verifyOrder error:",
      error && error.stack ? error.stack : error
    );
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      return res.status(400).json({
        success: false,
        message: "orderId and orderStatus are required",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating order status" });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user && req.user.id ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const orders = await orderModel
      .find({ userId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("getUserOrders error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user orders" });
  }
};

export {
  placeOrder,
  getOrder,
  verifyOrder,
  listOrders,
  updateOrderStatus,
  getUserOrders,
};
