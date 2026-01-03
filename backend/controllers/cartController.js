import { CommandSucceededEvent } from "mongodb";
import userModel from "../models/userModel.js";

//add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.user.id });
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.user.id, { cartData });
    return res.status(200).json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

//remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.user.id });
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId]) {
      if (cartData[req.body.itemId] > 1) {
        cartData[req.body.itemId] -= 1;
      } else {
        delete cartData[req.body.itemId];
      }
    }
    await userModel.findByIdAndUpdate(req.user.id, { cartData });
    return res.status(200).json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

//fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.user.id });
    let cartData = userData.cartData || {};
    return res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
