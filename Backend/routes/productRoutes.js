import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import { validateIdMongo } from "../middlewares/validateIdMongo.js";
import verifyAdmin from "./../middlewares/verifyAdmin.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", validateIdMongo, getProductById);
productRoutes.post("/", verifyAdmin, createProduct);
productRoutes.put("/:id", verifyAdmin, validateIdMongo, updateProduct);
productRoutes.delete("/:id", verifyAdmin, deleteProduct);

export default productRoutes;
