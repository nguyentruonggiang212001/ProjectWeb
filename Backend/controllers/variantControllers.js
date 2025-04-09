import Product from "../models/Product.js";
import Variant from "./../models/Variant.js";

export const getAllVariants = async (req, res) => {
  try {
    const variants = await Variant.find()
      .populate("productId", "name")
      .populate("attributes.attributeId", "name");

    if (!variants || variants.length === 0) {
      return res
        .status(404)
        .json({ error: "Không có biến thể nào được tìm thấy" });
    }

    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVariantsBytId = async (req, res) => {
  try {
    const { id } = req.params;

    const variants = await Variant.find({ productId: id })
      .populate("productId", "name")
      .populate("attributes.attributeId", "name");

    if (!variants || variants.length === 0) {
      return res
        .status(404)
        .json({ error: "Không có biến thể nào cho sản phẩm này" });
    }

    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo biến thể sản phẩm
export const createVariant = async (req, res) => {
  try {
    const { productId, attributes, stock, price, sku } = req.body;

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    const variant = await Variant.create({
      productId,
      attributes,
      stock,
      price,
      sku,
    });
    product.variants.push(variant._id);
    product.save();

    res.status(201).json({
      message: "Tạo biến thể sản phẩm thành công",
      variant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { variantId } = req.params; // Lấy đúng ID biến thể
    const { stock, price, attributes } = req.body;

    const variant = await Variant.findById(variantId); // Tìm theo ID biến thể
    if (!variant) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy biến thể sản phẩm" });
    }

    // Cập nhật thuộc tính nếu có
    if (attributes) {
      variant.attributes = attributes;
    }

    // Cập nhật tồn kho và giá
    variant.stock = stock ?? variant.stock; // Giữ nguyên nếu không có giá trị mới
    variant.price = price ?? variant.price;

    await variant.save();

    res.status(200).json({
      message: "Cập nhật biến thể sản phẩm thành công",
      variant,
    });
  } catch (error) {
    console.error(" Lỗi cập nhật biến thể:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa biến thể sản phẩm
export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await Variant.findById(id);
    if (!variant) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy biến thể sản phẩm" });
    }

    await Variant.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa biến thể sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
