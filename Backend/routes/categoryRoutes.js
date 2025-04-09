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

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", validateIdMongo, getCategoryById);
categoryRouter.get("/slug/:slug", getCategoryBySlug);
categoryRouter.post("/", createCategory);
categoryRouter.patch("/:id", validateIdMongo, updateCategoryById);
categoryRouter.delete("/:id", validateIdMongo, removeCategory);

export default categoryRouter;
