import mongoose, { Schema } from "mongoose";
import slugMiddleware from "./../middlewares/slugMiddleware.js";

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

categorySchema.plugin(slugMiddleware("title", "slug"));

const Category = mongoose.model("Category", categorySchema);

export default Category;
