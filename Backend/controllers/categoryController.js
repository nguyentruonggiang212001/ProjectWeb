import Category from "./../models/Category.js";
import mongoose from "mongoose";
import Product from "./../models/Product.js";

export const getAllCategories = async (req, res) => {
  try {
    const data = await Category.find({ isHidden: false }).populate("products");
    if (!data.length) {
      return res.status(404).json({
        message: "không tìm thấy category",
      });
    }
    return res.status(200).json({
      message: "lấy danh category thành công",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  //  Kiểm tra nếu `id` bị undefined hoặc không hợp lệ
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ error: "ID không hợp lệ hoặc không tồn tại!" });
  }

  try {
    const category = await Category.findById(id).populate("products");
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ error: "Lỗi server hoặc ID không hợp lệ!" });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const category = await Category.findOne({ slug: slug }).populate({
      path: "products",
      populate: [
        {
          path: "variants",
          populate: {
            path: "attributes",
            populate: {
              path: "attributeId",
            },
          },
        },
        {
          path: "categoryId", // Thêm populate cho categoryId
          select: "title", // Chỉ lấy trường title của category
        },
      ],
    });

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }

    res.json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const data = req.body;

    const newCategory = await Category.findOne({ title: data.title });
    if (newCategory) {
      return res.status(400).json({ error: "danh mục đã tồn tại" });
    }

    const category = await Category.create(data);

    if (!category) {
      return res.status(400).json({
        message: "lỗi khi khởi tạo category",
      });
    }
    return res.status(201).json({
      message: "tạo category thành công",
      category,
    });
  } catch (error) {
    return handleError500(res, error);
  }
};

export const updateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "không tìm thấy danh mục" });
    }
    const data = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json({
      message: "cập nhật danh mục thành công",
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "không tìm thấy id danh mục" });
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "xóa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
