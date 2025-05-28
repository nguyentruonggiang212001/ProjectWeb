import { Router } from "express";
import { validateIdMongo } from "./../middlewares/validateIdMongo.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  removeCategory,
  updateCategoryById,
} from "./../controllers/categoryController.js";

import verifyAdmin from "./../middlewares/verifyAdmin.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", validateIdMongo, getCategoryById);
categoryRouter.get("/slug/:slug", getCategoryBySlug);
categoryRouter.post("/", verifyAdmin, createCategory);
categoryRouter.patch("/:id", verifyAdmin, validateIdMongo, updateCategoryById);
categoryRouter.delete("/:id", verifyAdmin, validateIdMongo, removeCategory);

export default categoryRouter;
