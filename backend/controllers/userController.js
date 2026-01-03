import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    const safeUser = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return res.status(200).json({ success: true, token, user: safeUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
//register user
const registeruser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    //validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const safeUser = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role || "user",
    };
    res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Get current user info (requires auth middleware)
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId)
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    const user = await userModel.findById(userId).lean();
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const safeUser = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role || "user",
    };
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: promote a user to admin by email or id
const promoteUser = async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId && !email) {
      return res
        .status(400)
        .json({ success: false, message: "userId or email required" });
    }
    const query = userId ? { _id: userId } : { email };
    const user = await userModel.findByIdAndUpdate(
      query,
      { role: "admin" },
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.json({
      success: true,
      message: "User promoted to admin",
      user,
      forceLogout: true,
    });
  } catch (err) {
    console.error("promoteUser error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: list users
const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("name email role").lean();
    return res.json({ success: true, users });
  } catch (err) {
    console.error("listUsers error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { loginUser, registeruser, promoteUser, listUsers, getCurrentUser };
