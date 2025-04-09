import { useEffect, useState } from "react";
import { getById } from "../services/productServices";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { schemaCart } from "../schemas/cartShema";
import { zodResolver } from "@hookform/resolvers/zod";

const CartList = ({
  cart,
  updateCart,
  removeFromCart,
  isOrderPage = false,
  onUpdateTotal,
  updateGuestCart,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id || null;
  // if (!userId) {
  //   console.warn(" Không tìm thấy userId, có thể gây lỗi khi xóa sản phẩm!");
  // }
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { register } = useForm({
    resolver: zodResolver(schemaCart),
  });

  useEffect(() => {
    const productId =
      typeof cart.productId === "object" ? cart.productId._id : cart.productId;
    const variantId =
      typeof cart.variantId === "object" ? cart.variantId._id : cart.variantId;

    if (!productId) {
      setError("Không tìm thấy sản phẩm này trong giỏ hàng.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await getById(productId);
        if (data.variants && data.variants.length > 0 && variantId) {
          const foundVariant = data.variants.find(
            (variant) => variant._id === variantId
          );

          if (foundVariant) {
            setProduct({
              ...data,
              selectedVariant: foundVariant,
              price: foundVariant.price,
              stock: foundVariant.stock,
            });
          } else {
            console.warn(" Không tìm thấy biến thể phù hợp!", variantId);
            setProduct(data);
          }
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error(" Lỗi khi lấy sản phẩm:", error);
        setError("Không thể tải thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [cart.productId, cart.variantId]);

  // const totalProduct = () => cart.quantity * (product?.price || 0);

  const totalProduct = () => {
    let price = product?.price || 0; // Lấy giá gốc

    if (product?.categoryId?.title === "Sale") {
      price *= 0.5; // Giảm giá 50%
    }

    return cart.quantity * price;
  };

  useEffect(() => {
    if (userId && onUpdateTotal) {
      // Chỉ gọi khi đã đăng nhập
      onUpdateTotal(cart._id, totalProduct());
    }
  }, [cart.quantity, product]);

  // const handleQuantityChangeGuest = (newQuantity) => {
  //   const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  //   const itemIndex = guestCart.findIndex(
  //     (item) => item.variantId === cart.variantId
  //   );

  //   if (itemIndex !== -1) {
  //     if (newQuantity < 1) {
  //       alert("Số lượng không thể nhỏ hơn 1!");
  //       return;
  //     }
  //     if (newQuantity > (product?.stock || 0)) {
  //       alert(`Số lượng không thể vượt quá tồn kho (${product?.stock || 0})`);
  //       return;
  //     }

  //     guestCart[itemIndex].quantity = newQuantity;
  //     localStorage.setItem("guestCart", JSON.stringify(guestCart));

  //     // Gọi callback để cập nhật UI
  //     if (updateGuestCart) {
  //       updateGuestCart([...guestCart]); // Cập nhật guestCart
  //     }
  //   }
  // };

  // const handleRemoveGuest = () => {
  //   // Hiển thị thông báo xác nhận
  //   if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
  //     const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  //     const updatedCart = guestCart.filter(
  //       (item) => item.variantId !== cart.variantId
  //     );

  //     localStorage.setItem("guestCart", JSON.stringify(updatedCart));

  //     // Gọi callback để cập nhật UI
  //     if (updateGuestCart) {
  //       updateGuestCart([...updatedCart]);
  //     }
  //   }
  // };

  const handleQuantityChangeGuest = (newQuantity) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    const itemIndex = guestCart.findIndex(
      (item) => item.variantId === cart.variantId
    );

    if (itemIndex !== -1) {
      guestCart[itemIndex].quantity = newQuantity;
      localStorage.setItem("guestCart", JSON.stringify(guestCart));

      // Kích hoạt sự kiện storage
      window.dispatchEvent(new Event("storage"));

      if (updateGuestCart) {
        updateGuestCart([...guestCart]);
      }
    }
  };

  const handleRemoveGuest = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.filter(
        (item) => item.variantId !== cart.variantId
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));

      // Kích hoạt sự kiện storage
      window.dispatchEvent(new Event("storage"));

      if (updateGuestCart) {
        updateGuestCart([...updatedCart]);
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (!userId) {
      handleQuantityChangeGuest(newQuantity);
      return;
    }

    // Xử lý cho người dùng đã đăng nhập
    if (!cart._id || !userId) {
      console.error(" Lỗi: Không tìm thấy userId hoặc ID sản phẩm!");
      return;
    }

    if (newQuantity < 1) {
      alert("Số lượng không thể nhỏ hơn 1!");
      return;
    }
    if (newQuantity > (product?.stock || 0)) {
      alert(`Số lượng không thể vượt quá tồn kho (${product?.stock || 0})`);
      return;
    }

    updateCart({
      userId,
      cartId: cart._id,
      cart: {
        productId:
          typeof cart.productId === "object"
            ? cart.productId._id
            : cart.productId,
        variantId: cart.variantId,
        quantity: Number(newQuantity),
      },
    });
  };

  const handleRemove = () => {
    if (!userId) {
      handleRemoveGuest();

      return;
    }

    // Xử lý cho người dùng đã đăng nhập
    if (!cart._id || !userId) {
      console.error("Lỗi: Không tìm thấy userId hoặc ID sản phẩm!");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      removeFromCart({
        userId,
        productId: cart.productId,
        variantId: cart.variantId,
      });
    }
  };

  if (loading) return <p> Đang tải sản phẩm...</p>;
  if (error) return <p style={{ color: "red" }}> {error}</p>;

  return (
    <div className="cart-content">
      <div>
        <img
          className="cart-img"
          src={product?.imageUrl || "https://via.placeholder.com/100"}
          alt={product?.title || "Sản phẩm"}
        />
      </div>
      <div>
        <span>Tên Hàng</span>
        <div className="cart-box" style={{ marginTop: "10px" }}>
          <h1>{product?.title || "Không tìm thấy sản phẩm"}</h1>
        </div>
        <div>
          {product?.selectedVariant?.attributes && (
            <>
              {product.selectedVariant.attributes.some(
                (attr) => attr.attributeId.name === "Size"
              ) && (
                <p>
                  <strong>Size:</strong>
                  {
                    product.selectedVariant.attributes.find(
                      (attr) => attr.attributeId.name === "Size"
                    )?.value
                  }
                </p>
              )}
              {product.selectedVariant.attributes.some(
                (attr) => attr.attributeId.name === "Color"
              ) && (
                <p>
                  <strong>Màu sắc:</strong>
                  {
                    product.selectedVariant.attributes.find(
                      (attr) => attr.attributeId.name === "Color"
                    )?.value
                  }
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <span className="price">Giá</span>
        <p className="price-sub">
          {product?.categoryId?.title === "Sale"
            ? `${(product.price * 0.5).toLocaleString()}₫`
            : `${product?.price?.toLocaleString()}₫`}
        </p>
      </div>
      <div>
        <span>Tồn kho</span>
        <p>
          {product?.stock
            ? `${product.stock} sản phẩm`
            : "Đang cập nhật tồn kho"}
        </p>
      </div>

      <div>
        <span>Số lượng</span>
        <div className="total">
          {!isOrderPage ? (
            <div className="quantity-control">
              <button
                className="left"
                onClick={() => handleQuantityChange(cart.quantity - 1)}
              >
                -
              </button>
              <div className="quantity">
                <input
                  style={{
                    width: "20px",
                    border: "none",
                    outline: "none",
                    textAlign: "center",
                  }}
                  type="text"
                  value={cart.quantity}
                  {...register("number", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleQuantityChange(parseInt(value) || 1);
                  }}
                />
              </div>
              <button
                className="right"
                onClick={() => handleQuantityChange(cart.quantity + 1)}
              >
                +
              </button>
            </div>
          ) : (
            <span
              style={{
                margin: "5px auto",
              }}
            >
              {cart.quantity}
            </span>
          )}
        </div>
      </div>

      <div>
        <span>Tổng tiền</span>
        <p className="product-total">{totalProduct().toLocaleString()}₫</p>
        {!isOrderPage && (
          <div
            className="delete-product"
            style={{ marginTop: "20px" }}
            onClick={handleRemove}
          >
            <i className="fa-regular fa-trash-can"></i>
          </div>
        )}
      </div>
    </div>
  );
};

//  Kiểm tra kiểu dữ liệu của props để tránh lỗi
CartList.propTypes = {
  cart: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      .isRequired,
    variantId: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      .isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  updateCart: PropTypes.func.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  isOrderPage: PropTypes.bool,
  onUpdateTotal: PropTypes.func,
  updateGuestCart: PropTypes.func,
};

export default CartList;
