import userModel from "../models/userModel.js";

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    next();
  } catch (err) {
    console.error("adminMiddleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default adminMiddleware;
