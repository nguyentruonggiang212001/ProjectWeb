import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  loginUser,
  registerUser,
  resetPassword,
  updateUser,
} from "../controllers/authControllers.js";

const authRoutes = Router();

authRoutes.get("/", verifyUser, verifyAdmin, getAllUsers);
authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.put("/profile/:id", verifyUser, updateUser);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.delete("/:id", verifyUser, verifyAdmin, deleteUser);

export default authRoutes;
