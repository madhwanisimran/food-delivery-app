import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const foodRouter = express.Router();

// ensure uploads directory exists
const uploadsDir = path.resolve(process.cwd(), "uploads");
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (err) {
  // if creation fails, log but continue; multer will error later if needed
  console.error("Could not create uploads directory:", err);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(
      /[^a-zA-Z0-9.\-_]/g,
      "_"
    )}`;
    return cb(null, safeName);
  },
});
const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
// support multiple removal patterns: POST /remove (body.id) and DELETE /:id
foodRouter.post("/remove", removeFood);
foodRouter.post("/delete", removeFood);
foodRouter.delete("/:id", removeFood);
export default foodRouter;
