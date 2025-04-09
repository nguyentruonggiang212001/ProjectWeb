// import { useEffect } from "react";
// import logo from "../img/e2baa9c4-a867-4560-b6df-58f892730209.jpg";
// import box from "../img/cart-content.svg";
// import content from "../img/icon-contact.webp";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCarts,
//   removeCarts,
//   editCarts,
// } from "../features/products/cartAction";
// import CartList from "./CartList";

// const CartPage = () => {
//   const { carts } = useSelector((state) => state.carts);
//   const dispatch = useDispatch();
//   const user = JSON.parse(localStorage.getItem("user") || "{}");
//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchCarts(user.id));
//     }
//   }, [user?.id, dispatch]);
//   const updateCart = (id, cart) => {
//     dispatch(editCarts({ id, cart }));
//   };
//   const removeFromCart = (cartId) => {
//     dispatch(removeCarts(cartId));
//   };
//   const totalAllProduct = () => {
//     return (
//       carts &&
//       carts.reduce((cur, acc) => {
//         return cur + acc.cartPrice * acc.quantity;
//       }, 0)
//     );
//   };
//   return (
//     <div>
//       <section>
//         <div className="cart">
//           <div className="container">
//             <div className="row">
//               <div className="col-12">
//                 <div className="cart-header">
//                   <div className="text-cart-header">
//                     <i className="fa-solid fa-cart-shopping"></i>
//                     <span className="text-first">GIỎ HÀNG</span>
//                   </div>
//                   <div className="text-cart-sub">
//                     <i className="fa-solid fa-box"></i>
//                     <span>ĐẶT HÀNG</span>
//                   </div>
//                   <div className="text-cart-sub">
//                     <i className="fa-solid fa-boxes-stacked"></i>
//                     <span>HOÀN THÀNH ĐƠN HÀNG</span>
//                   </div>
//                 </div>
//                 <a href="#">
//                   <img className="img-cart" src={logo} alt="logo" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="container">
//         <button className="icon-contact">
//           <a href="https://zalo.me/4260866750527113904">
//             <img src={content} alt="content" />
//           </a>
//         </button>
//       </div>

//       {carts.length < 1 ? (
//         <div className="cart-main">
//           <img src={box} alt="Empty Cart" />
//           <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
//           <button className="button">
//             <a href="/">
//               <i className="fa-solid fa-basket-shopping"></i>TIẾP TỤC MUA SẮM
//             </a>
//           </button>
//         </div>
//       ) : (
//         <div className="container">
//           <div className="row">
//             <div className="col-lg-8 col-sm-12 col-12">
//               <div>
//                 {carts &&
//                   carts.map((cart) => (
//                     <CartList
//                       key={cart.id}
//                       cart={cart}
//                       updateCart={updateCart}
//                       removeFromCart={removeFromCart}
//                     />
//                   ))}
//               </div>
//             </div>
//             <div className="col-lg-4 col-sm-12 col-12">
//               <div className="cart-content-sub">
//                 <div className="cart-content-sub-product">
//                   <span>ĐƠN HÀNG</span>
//                 </div>
//                 <div className="cart-content-total">
//                   <p>
//                     Tổng giá trị đơn hàng:
//                     <span id="total-price">{totalAllProduct()}$</span>
//                   </p>
//                 </div>
//                 <button
//                   id="check-total"
//                   onClick={() =>
//                     alert(
//                       `Tổng hóa đơn của bạn là ${totalAllProduct(carts).toFixed(
//                         2
//                       )}$`
//                     )
//                   }
//                 >
//                   THANH TOÁN HÓA ĐƠN
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;

import { useEffect, useMemo, useState } from "react";
import logo from "../img/e2baa9c4-a867-4560-b6df-58f892730209.jpg";
import box from "../img/cart-content.svg";
import content from "../img/icon-contact.webp";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCarts,
  removeCarts,
  editCarts,
} from "../features/products/cartAction";
import CartList from "./CartList";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const CartPage = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Kiểm tra xem user có tồn tại và có _id không
    if (!user?._id) {
      // Hiển thị thông báo toast
      toast.error("Bạn chưa đăng nhập nên chưa thể thanh toán.");

      // Chuyển hướng đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Thay đổi thời gian nếu cần
    } else {
      // Nếu có userId, chuyển hướng đến trang thanh toán
      navigate("/order");
    }
  };

  // Lấy giỏ hàng từ Redux state
  const carts = useSelector((state) => state.carts.carts || []);

  //  Dùng useMemo để tránh tạo mảng mới mỗi lần render
  const memoizedCarts = useMemo(() => carts ?? [], [carts]);

  // State để quản lý giỏ hàng tạm thời
  const [guestCart, setGuestCart] = useState(
    JSON.parse(localStorage.getItem("guestCart")) || []
  );

  // Lắng nghe sự kiện storage để cập nhật guestCart
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedGuestCart =
        JSON.parse(localStorage.getItem("guestCart")) || [];
      setGuestCart(updatedGuestCart);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Kết hợp giỏ hàng từ Redux và giỏ hàng tạm thời
  const combinedCarts = useMemo(() => {
    return [...carts, ...guestCart];
  }, [carts, guestCart]); // Sửa dependencies thành carts và guestCart

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCarts(user._id));
    }
  }, [user?._id, dispatch]);

  useEffect(() => {}, [memoizedCarts]);

  const updateGuestCart = (newGuestCart) => {
    setGuestCart(newGuestCart); // Cập nhật state giỏ hàng tạm thời
    localStorage.setItem("guestCart", JSON.stringify(newGuestCart)); // Cập nhật localStorage
  };

  const updateCart = ({ userId, cartId, cart }) => {
    // Kiểm tra nếu là khách hàng
    if (!userId || !cartId) {
      console.warn(
        "Cập nhật giỏ hàng cho khách hàng, không cần userId và cartId."
      );
      // Thực hiện cập nhật giỏ hàng cho khách hàng ở đây
      dispatch(editCarts({ cart })); // Giả sử bạn có một action để cập nhật giỏ hàng cho khách
      return;
    }

    // Nếu có userId và cartId, thực hiện cập nhật bình thường
    dispatch(editCarts({ userId, cartId, cart }));
  };

  const removeFromCart = ({ userId, productId, variantId }) => {
    if (!userId) {
      console.warn("Xóa sản phẩm cho khách hàng, không cần userId.");
      // Xóa sản phẩm khỏi giỏ hàng cho khách hàng
      const existingCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = existingCart.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return; // Kết thúc hàm
    }

    // Nếu có userId, thực hiện xóa bình thường
    dispatch(removeCarts({ userId, productId, variantId }));
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [cartTotals, setCartTotals] = useState({});

  // Dùng cho người dùng đã đăng nhập
  const handleUpdateTotal = (cartId, total) => {
    setCartTotals((prevTotals) => {
      const updatedTotals = { ...prevTotals, [cartId]: total };
      const newTotalPrice = Object.values(updatedTotals).reduce(
        (sum, value) => sum + value,
        0
      );
      setTotalPrice(newTotalPrice);
      return updatedTotals;
    });
  };

  const calculateGuestCartTotal = () => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    // console.log("Danh sách sản phẩm trong guestCart:", guestCart);
    const total = guestCart.reduce((sum, item) => {
      return sum + item.quantity * (item.price || 0); // Tính tổng cho tất cả sản phẩm
    }, 0);
    // console.log("Tổng tiền guestCart:", total); // Kiểm tra tổng
    setTotalPrice(total); // Cập nhật tổng tiền
  };

  // Gọi hàm này mỗi khi guestCart thay đổi
  useEffect(() => {
    if (!user?._id) {
      calculateGuestCartTotal();
    }
  }, [guestCart]); // Kích hoạt khi guestCart thay đổi

  return (
    <div>
      <section>
        <div className="cart">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="cart-header">
                  <div className="text-cart-header">
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span className="text-first">GIỎ HÀNG</span>
                  </div>
                  <div className="text-cart-sub">
                    <i className="fa-solid fa-box"></i>
                    <span>ĐẶT HÀNG</span>
                  </div>
                  <div className="text-cart-sub">
                    <i className="fa-solid fa-boxes-stacked"></i>
                    <span>HOÀN THÀNH ĐƠN HÀNG</span>
                  </div>
                </div>
                <a href="/">
                  <img className="img-cart" src={logo} alt="logo" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button className="icon-contact" style={{ marginLeft: "40px" }}>
        <a href="https://zalo.me/4260866750527113904">
          <img src={content} alt="content" />
        </a>
      </button>

      {combinedCarts.length === 0 ? (
        <div className="cart-main">
          <img src={box} alt="Empty Cart" />
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
          <button className="button">
            <a href="/">
              <i className="fa-solid fa-basket-shopping"></i> TIẾP TỤC MUA SẮM
            </a>
          </button>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div
              className="col-lg-8 col-sm-12 col-12"
              style={{ border: "1px solid #80808059", marginBottom: "10px" }}
            >
              {combinedCarts
                .filter((cart) => cart.productId)
                .map((cart, index) => {
                  // console.log("Cart:", cart); // Kiểm tra giá trị của cart
                  return (
                    <CartList
                      key={cart._id || cart.id || index}
                      cart={cart}
                      updateCart={updateCart}
                      removeFromCart={removeFromCart}
                      onUpdateTotal={handleUpdateTotal}
                      updateGuestCart={updateGuestCart}
                    />
                  );
                })}
            </div>
            <div className="col-lg-4 col-sm-12 col-12">
              <div className="cart-content-sub">
                <div className="cart-content-sub-product">
                  <span>ĐƠN HÀNG</span>
                </div>
                <div className="cart-content-total">
                  <p>
                    Tổng giá trị đơn hàng:
                    {/* <span id="total-price">
                      {Math.floor(totalAllProduct).toLocaleString("vi-VN")}₫
                    </span> */}
                    <span id="total-price">
                      {totalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </p>
                </div>
                {/* <button id="check-total" onClick={() => navigate("/order")}>
                  THANH TOÁN HÓA ĐƠN
                </button> */}
                <button id="check-total" onClick={handleCheckout}>
                  THANH TOÁN HÓA ĐƠN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CartPage;
