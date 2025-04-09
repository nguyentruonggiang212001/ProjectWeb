import express from "express";
import {
  createAttribute,
  deleteAttribute,
  getAllAttributes,
  getAttributeById,
  updateAttribute,
} from "./../controllers/attributeController.js";
import { validateIdMongo } from "./../middlewares/validateIdMongo.js";
import verifyUser from "./../middlewares/verifyUser.js";

const attributeRouter = express.Router();

attributeRouter.get("/", getAllAttributes);
attributeRouter.get("/:id", validateIdMongo, getAttributeById);
attributeRouter.post("/", verifyUser, createAttribute);
attributeRouter.put("/:id", verifyUser, validateIdMongo, updateAttribute);
attributeRouter.delete("/:id", verifyUser, validateIdMongo, deleteAttribute);

export default attributeRouter;
