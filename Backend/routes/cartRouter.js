import express from "express";
import {
  addToCart,
  getCartByUserId,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.get("/:userId", getCartByUserId);
cartRouter.put("/:userId/update", updateCartItem);
cartRouter.delete("/:userId/remove", removeCartItem);

export default cartRouter;
