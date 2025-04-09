import mongoose, { Schema } from "mongoose";
import slugMiddleware from "../middlewares/slugMiddleware.js";

const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "Updating",
    },
    basePrice: {
      type: Number,
    },
    totalStock: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default: "https://demofree.sirv.com/nope-not-here.jpg",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    slug: {
      type: String,
      unique: true,
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

productsSchema.plugin(slugMiddleware(["title", "variants"], "slug"));

const Product = mongoose.model("Product", productsSchema);

export default Product;
