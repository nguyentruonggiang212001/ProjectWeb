import { Router } from "express";
import {
  createOrder,
  deleteOrderByAdmin,
  deleteOrderById,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
} from "./../controllers/orderController.js";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const orderRoutes = Router();
orderRoutes.get("/", verifyAdmin, getAllOrders);
orderRoutes.post("/", verifyUser, createOrder);
orderRoutes.get("/user/:userId", verifyUser, getOrdersByUserId);
orderRoutes.get("/:orderId", verifyUser, getOrderById);
orderRoutes.delete("/:orderId", verifyUser, deleteOrderById);
orderRoutes.patch("/:orderId/status", verifyAdmin, updateOrderStatus);
orderRoutes.delete("/:orderId/admin", verifyAdmin, deleteOrderByAdmin);

export default orderRoutes;
