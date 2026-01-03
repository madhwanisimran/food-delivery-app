import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }
  const [scheme, token] = authHeader.split(" ");

  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || decoded._id || decoded.userId,
    };
    console.log("JWT DECODED 👉", decoded);

    next();
  } catch (error) {
    console.error("JWT error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
