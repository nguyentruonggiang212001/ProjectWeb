import { useEffect, useState } from "react";
import { getById } from "../services/productServices";
import PropTypes from "prop-types";

const OrderItem = ({ item }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getById(item.productId);

        // Kiểm tra xem có variants không, và có variantId hợp lệ không
        let selectedVariant = null;
        if (data.variants && item.variantId) {
          selectedVariant =
            data.variants.find((variant) => variant._id === item.variantId) ||
            null;
        }

        setProduct({
          ...data,
          selectedVariant: selectedVariant,
        });
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [item.productId, item.variantId]);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Lấy giá tiền từ variant hoặc sản phẩm chính
  let price = Number(
    product?.selectedVariant?.price || product?.basePrice || 0
  );

  // Giảm giá 50% nếu sản phẩm thuộc danh mục "Sale"
  if (product?.categoryId?.title === "Other") {
    price *= 0.5;
  }

  // Lấy màu sắc và kích thước từ attributes (sửa lỗi ở đây)
  const attributes = product?.selectedVariant?.attributes || [];
  const sizeAttr = attributes.find(
    (attr) => attr?.attributeId?.name?.toLowerCase() === "size"
  );
  const colorAttr = attributes.find(
    (attr) => attr?.attributeId?.name?.toLowerCase() === "color"
  );

  const size = sizeAttr?.value;
  const color = colorAttr?.value;

  return (
    <li>
      <div className="order-list">
        {/* Hiển thị hình ảnh sản phẩm */}
        <img
          src={product?.imageUrl || "https://via.placeholder.com/100"}
          alt={product?.title || "Sản phẩm"}
          width="100"
        />

        {/* Hiển thị thông tin sản phẩm */}
        <p>
          <strong>Sản phẩm:</strong>{" "}
          {product?.title || "Không tìm thấy sản phẩm"}
        </p>
        <p>
          <strong>Giá:</strong> <span> {price.toLocaleString()}₫</span>
        </p>
        <p>
          <strong>Số lượng:</strong> <span>{item.quantity}</span>
        </p>
        <p>
          <strong>Màu sắc:</strong> <span>{color}</span>
        </p>
        <p>
          <strong>Kích thước:</strong> <span>{size}</span>
        </p>
      </div>
    </li>
  );
};

// Định nghĩa kiểu dữ liệu đầu vào để tránh lỗi
OrderItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    productId: PropTypes.string.isRequired,
    variantId: PropTypes.string,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrderItem;
