import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import verifyUser from "../middlewares/verifyUser.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", validateIdMongo, getProductById);
productRoutes.post("/", verifyUser, createProduct);
productRoutes.put("/:id", validateIdMongo, updateProduct);
productRoutes.delete("/:id", deleteProduct);

export default productRoutes;
