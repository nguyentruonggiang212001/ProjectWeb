import express from "express";
import verifyUser from "../middlewares/verifyUser.js";
import {
  createVariant,
  deleteVariant,
  getAllVariants,
  getVariantsBytId,
  updateVariant,
} from "./../controllers/variantControllers.js";
import { validateIdMongo } from "../middlewares/validateIdMongo.js";

const variantRouter = express.Router();
variantRouter.get("/", getAllVariants);
variantRouter.get("/:id", getVariantsBytId);
variantRouter.post("/", verifyUser, createVariant);
variantRouter.patch("/:variantId", verifyUser, validateIdMongo, updateVariant);
variantRouter.delete("/:id", verifyUser, validateIdMongo, deleteVariant);

export default variantRouter;
