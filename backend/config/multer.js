import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "food-delivery/foods",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
    public_id: (req, file) => {
      const name = file.originalname.split(".")[0];
      return `${Date.now()}-${name}`;
    },
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new Error("Only image files are allowed (jpeg, png, webp, gif)")
      );
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
