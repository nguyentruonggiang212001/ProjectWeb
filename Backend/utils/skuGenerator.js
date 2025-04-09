export function generateSKU({ productSlug, productId, size, color }) {
  const productCode = productSlug || productId.toString().slice(-6); // Sử dụng slug nếu có, nếu không thì lấy 6 ký tự cuối của _id
  const sizeCode = size ? size.toUpperCase() : "NA"; // Mặc định là "NA" nếu không có size
  const colorCode = color ? color.toUpperCase().replace(/\s+/g, "") : "NA"; // Loại bỏ khoảng trắng
  const timestamp = Date.now().toString().slice(-5); // Sử dụng 5 số cuối của timestamp làm ID ngẫu nhiên tránh trùng lặp

  return `${productCode}-${sizeCode}-${colorCode}-${timestamp}`;
}
