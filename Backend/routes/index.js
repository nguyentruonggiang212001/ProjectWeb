import { Router } from "express";
import productRoutes from "./productRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import authRoutes from "./authRoutes.js";
import attributeRouter from "./attributeRouter.js";
import variantRouter from "./variantRoutes.js";
import cartRouter from "./cartRouter.js";
import orderRoutes from "./orderRouter.js";

const routes = Router();
routes.use("/products", productRoutes);
routes.use("/category", categoryRouter);
routes.use("/auth", authRoutes);
routes.use("/variants", variantRouter);
routes.use("/attribute", attributeRouter);
routes.use("/cart", cartRouter);
routes.use("/orders", orderRoutes);

export default routes;
