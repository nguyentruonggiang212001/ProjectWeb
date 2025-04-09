import * as z from "zod";

// Schema cho 1 variant
const variantSchema = z.object({
  size: z.string().nonempty({ message: "Size không được bỏ trống" }).optional(),
  color: z
    .string()
    .nonempty({ message: "Color không được bỏ trống" })
    .optional(),
  price: z.number().positive({ message: "Giá variant phải là số dương" }),
  stock: z
    .number()
    .int()
    .nonnegative({ message: "Số lượng variant phải là số nguyên không âm" }),
  sku: z.string().nonempty({ message: "SKU không được bỏ trống" }),
});

// Schema sản phẩm bao gồm variants
export const schemaProduct = z.object({
  title: z
    .string()
    .min(6, { message: "Tên sản phẩm tối thiểu 6 ký tự" })
    .trim(),
  basePrice: z.number().positive({ message: "Giá sản phẩm phải là số dương" }),

  description: z.string().optional(),
  thumbnail: z.any().optional(),
  categoryId: z.string().nonempty({ message: "Vui lòng chọn một danh mục" }),
  totalStock: z
    .number()
    .positive({ message: "Số lượng tồn kho phải là số dương" }),

  // 🔥 Sửa lỗi: Thêm variants vào schema
  variants: z.array(variantSchema).optional(),
});
