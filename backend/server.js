import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import path from "path";
import userRouter from "./routes/userRoute.js";
import "dotenv/config.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoute.js";
import compression from "compression";

// app config
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(compression());

// db connection
connectDB();

// api routes
app.use("/api/food", foodRouter);
const uploadsPath = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.use(
  cors({
    origin: [
      "https://food-delivery-app-0.onrender.com",
      "https://food-delivery-app-2-k996.onrender.com",
    ],
    credentials: true,
  })
);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  const status = err && err.statusCode ? err.statusCode : 500;
  const message = err && err.message ? err.message : "Internal Server Error";
  res.status(status).json({ success: false, message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
