import Attribute from "../models/Attribute.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";
import Category from "./../models/Category.js";
import slugify from "slugify";

const createUniqueSlug = async (title) => {
  let slug = slugify(title, { lower: true });
  let existingProduct = await Product.findOne({ slug });
  let count = 1;

  while (existingProduct) {
    slug = `${slug}-${count}`;
    existingProduct = await Product.findOne({ slug });
    count++;
  }

  return slug;
};

// Lấy tất cả sản phẩm

export const getAllProducts = async (req, res) => {
  try {
    let { category, search } = req.query;
    let filter = { isHidden: false };

    // Tìm theo danh mục nếu có
    if (category) {
      const foundCategory = await Category.findOne({
        title: { $regex: new RegExp(`^${category}$`, "i") },
      });
      if (!foundCategory) {
        return res.status(404).json({ message: "Không tìm thấy danh mục" });
      }
      filter.categoryId = foundCategory._id;
    }

    // 🔍 **Tìm kiếm theo title (không phân biệt hoa thường)**
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("categoryId", "title")
      .populate({
        path: "variants",
        populate: { path: "attributes.attributeId", select: "name" },
      });

    res.status(200).json(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("categoryId", "title")
      .populate({
        path: "variants",
        populate: { path: "attributes.attributeId", select: "name" },
      });

    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    let {
      title,
      description,
      basePrice,
      totalStock,
      imageUrl,
      categoryId,
      variants = [],
      slug,
    } = req.body;

    // Kiểm tra danh mục có tồn tại không
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Danh mục không tồn tại" });
    }

    // Nếu không có slug, tự động tạo slug từ title
    if (!slug) {
      slug = await createUniqueSlug(title);
    }

    // Tạo sản phẩm trước (chưa có variants)
    const product = await Product.create({
      title,
      description,
      basePrice,
      totalStock,
      imageUrl,
      categoryId,
      slug,
      variants: [],
    });

    // Lấy ObjectId của attributes (Size, Color)
    const [sizeAttr, colorAttr] = await Promise.all([
      Attribute.findOne({ name: "Size" }),
      Attribute.findOne({ name: "Color" }),
    ]);

    // Xử lý variants
    const variantDocs = variants
      .map(({ attributes, stock, price, sku }) => {
        // Lọc và lấy giá trị của attributes hợp lệ
        const processedAttributes = attributes
          .map(({ attributeId, value }) => ({
            attributeId,
            value,
          }))
          .filter(({ value }) => value); // Bỏ attributes không có giá trị

        //  Nếu SKU không có, tự động tạo SKU
        if (!sku) {
          const sizeValue =
            processedAttributes.find(
              (attr) => attr.attributeId === sizeAttr?._id
            )?.value || "XX";
          const colorValue =
            processedAttributes.find(
              (attr) => attr.attributeId === colorAttr?._id
            )?.value || "XX";
          const randomPart = Math.floor(1000 + Math.random() * 9000);
          sku = `TS-${sizeValue}-${colorValue}-${randomPart}`;
        }

        // Đảm bảo có SKU hợp lệ và ít nhất một thuộc tính (Size hoặc Color)
        if (processedAttributes.length === 0 && !sku) return null;

        return {
          productId: product._id,
          attributes: processedAttributes,
          stock,
          price,
          sku,
        };
      })
      .filter(Boolean); // Loại bỏ null

    // Nếu có variants, lưu vào database
    if (variantDocs.length > 0) {
      const insertedVariants = await Variant.insertMany(variantDocs);
      const variantIds = insertedVariants.map((v) => v._id);

      // Cập nhật danh sách variants trong Product
      await Product.updateOne(
        { _id: product._id },
        { $set: { variants: variantIds } }
      );
    }

    // Thêm sản phẩm vào danh mục
    await Category.updateOne(
      { _id: categoryId },
      { $push: { products: product._id } }
    );

    res.status(201).json({
      message: "Sản phẩm đã được tạo",
      product,
      variants: variantDocs,
    });
  } catch (error) {
    console.error(" Lỗi khi tạo sản phẩm:", error);
    res.status(500).json({ error: error.message });
  }
};

// CẬP NHẬT SẢN PHẨM
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { variants, ...productFields } = req.body;

    console.log(" Dữ liệu nhận từ frontend:", req.body);

    // Kiểm tra sản phẩm có tồn tại không
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    // Cập nhật thông tin sản phẩm (ngoại trừ variants)
    if (Object.keys(productFields).length > 0) {
      await Product.findByIdAndUpdate(productId, productFields, { new: true });
    }

    // Xử lý variants
    if (variants && Array.isArray(variants)) {
      const updatedVariantIds = [];

      // Lấy ID của Size và Color từ database
      const [sizeAttr, colorAttr] = await Promise.all([
        Attribute.findOne({ name: "Size" }),
        Attribute.findOne({ name: "Color" }),
      ]);

      for (const variant of variants) {
        if (variant._id) {
          // Nếu variant đã có _id, chỉ cập nhật, không kiểm tra SKU
          console.log(" Cập nhật variant:", variant);
          const updatedVariant = await Variant.findByIdAndUpdate(
            variant._id,
            variant,
            { new: true }
          );
          if (updatedVariant) {
            updatedVariantIds.push(updatedVariant._id);
          }
        } else {
          // Nếu variant mới (không có _id), kiểm tra SKU trước khi thêm
          let { sku, attributes, stock, price } = variant;

          // Lọc và lấy giá trị của attributes hợp lệ
          const processedAttributes = attributes
            .map(({ attributeId, value }) => ({
              attributeId,
              value,
            }))
            .filter(({ value }) => value); // Bỏ attributes không có giá trị

          // Lấy giá trị Size và Color nếu có
          const sizeValue =
            processedAttributes.find(
              (attr) => attr.attributeId === sizeAttr?._id
            )?.value || "XX";
          const colorValue =
            processedAttributes.find(
              (attr) => attr.attributeId === colorAttr?._id
            )?.value || "XX";

          // Nếu không có SKU, tự động tạo SKU hợp lệ
          if (!sku) {
            sku = generateSKU(sizeValue, colorValue);
          }

          // Kiểm tra SKU đã tồn tại chưa
          const existingVariant = await Variant.findOne({ sku });
          if (existingVariant) {
            return res.status(400).json({
              error: `SKU ${sku} đã tồn tại. Vui lòng chọn SKU khác!`,
            });
          }

          // Tạo variant mới
          const newVariant = new Variant({
            productId,
            attributes: processedAttributes,
            stock,
            price,
            sku,
          });

          await newVariant.save();
          updatedVariantIds.push(newVariant._id);
        }
      }

      // Nếu không có variants mới, giữ nguyên danh sách cũ
      if (updatedVariantIds.length === 0) {
        updatedVariantIds.push(...existingProduct.variants);
      }

      // Cập nhật danh sách variants trong Product
      existingProduct.variants = updatedVariantIds;
      await existingProduct.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    console.error(" Lỗi khi cập nhật sản phẩm:", error);
    return res
      .status(500)
      .json({ success: false, message: "Có lỗi xảy ra khi cập nhật sản phẩm" });
  }
};

// Xóa sản phẩm (ẩn thay vì xóa cứng)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
