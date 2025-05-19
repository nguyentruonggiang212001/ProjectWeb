import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarts } from "../features/products/cartAction";
import { createOrder } from "../services/orderService";
import CartList from "./CartList";
import { zodResolver } from "./../../node_modules/@hookform/resolvers/zod/src/zod";
import { useForm } from "react-hook-form";
import { orderSchema } from "../schemas/orderShema";
import { useNavigate } from "react-router-dom";
import { resetCarts } from "../features/products/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const OrderPage = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(orderSchema),
  });
  const userId = user?._id || null;
  const carts = useSelector((state) => state.carts.carts || []);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCarts(userId));
    }
    // Lấy thông tin người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setValue("fullName", userInfo.fullName);
      setValue("email", userInfo.email);
      setValue("phone", userInfo.phone);
      setValue("address", userInfo.address);
    }
  }, [userId, dispatch, setValue]);

  const handleOrder = async (data) => {
    if (!userId || carts.length === 0) {
      toast.error("Giỏ hàng trống hoặc chưa đăng nhập!");
      return;
    }

    try {
      const response = await createOrder({ userId, ...data });

      // Nếu đặt hàng thành công, xóa giỏ hàng trên Redux
      dispatch(resetCarts());

      toast.success("Đặt hàng thành công!");
      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    } catch (error) {
      toast.error("Đặt hàng thất bại!");
      console.error(error);
    }
  };

  const updateCart = (updatedItem) => {
    console.log("Cập nhật giỏ hàng:", updatedItem);
  };

  const removeFromCart = (itemId) => {
    console.log("Xóa sản phẩm khỏi giỏ hàng:", itemId);
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [cartTotals, setCartTotals] = useState({});

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

  // const handlePayment = async () => {
  //   if (!userId || totalPrice <= 0) {
  //     toast.error("Vui lòng đăng nhập và thêm sản phẩm vào giỏ hàng!");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("http://localhost:5000/payment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId,
  //         amount: totalPrice,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.order_url) {
  //       window.location.href = data.order_url; // Điều hướng đến trang thanh toán
  //     } else {
  //       toast.error("Có lỗi xảy ra khi tạo đơn thanh toán!");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi thanh toán:", error);
  //     toast.error("Không thể kết nối đến máy chủ!");
  //   }
  // };

  const handlePayment = async (data) => {
    const { fullName, email, phone, address } = data; // Lấy dữ liệu từ form

    console.log(data);

    if (!userId || totalPrice <= 0) {
      toast.error("Vui lòng đăng nhập và thêm sản phẩm vào giỏ hàng!");
      return;
    }

    // Tiến hành thanh toán
    try {
      const response = await fetch("http://localhost:5000/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: totalPrice,
        }),
      });

      const responseData = await response.json();
      console.log("Phản hồi từ backend:", responseData);

      if (responseData.order_url) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("userInfo", JSON.stringify(data));
        window.location.href = responseData.order_url; // Điều hướng đến trang thanh toán
      } else {
        toast.error("Có lỗi xảy ra khi tạo đơn thanh toán!");
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.error("Không thể kết nối đến máy chủ!");
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <section>
        <div className="cart">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="cart-header">
                  <div className="text-cart-header">
                    <i
                      style={{ color: "black" }}
                      className="fa-solid fa-cart-shopping"
                    ></i>
                    <span className="text-first" style={{ color: " black" }}>
                      GIỎ HÀNG
                    </span>
                  </div>
                  <div className="text-cart-sub">
                    <i
                      className="fa-solid fa-box"
                      style={{ color: " rgb(201, 33, 39)" }}
                    ></i>
                    <span style={{ color: " rgb(201, 33, 39)" }}>ĐẶT HÀNG</span>
                  </div>
                  <div className="text-cart-sub">
                    <i className="fa-solid fa-boxes-stacked"></i>
                    <span>HOÀN THÀNH ĐƠN HÀNG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-sm-12 col-12">
            <div className="payment" style={{ border: "1px solid #ccc" }}>
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <i className="fa-solid fa-money-check"></i>
                  <p
                    style={{
                      fontSize: "20px",
                      marginLeft: "20px",
                    }}
                  >
                    PHƯƠNG THỨC THANH TOÁN
                  </p>
                </div>
                <button
                  onClick={handleSubmit(handlePayment)}
                  style={{
                    padding: "10px 20px",
                    background: "#008fe5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  Thanh toán qua ZaloPay
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-sm-12 col-12">
            <div
              className="form-register"
              style={{ border: "1px solid #80808059", marginBottom: "10px" }}
            >
              <form className="form-oder">
                <div style={{ display: "flex", gap: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <p>
                      HỌ VÀ TÊN
                      <span style={{ color: "rgb(201, 33, 39)" }}>*</span>
                    </p>
                    <input
                      type="text"
                      placeholder="Họ tên"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="error">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <p>
                      EMAIL <span style={{ color: "rgb(201, 33, 39)" }}>*</span>
                    </p>
                    <input
                      type="email"
                      placeholder="Email"
                      {...register("email")}
                      style={{ margin: "0" }}
                    />
                    {errors.email && (
                      <p className="error">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <p>
                  SĐT <span style={{ color: "rgb(201, 33, 39)" }}>*</span>
                </p>
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="error">{errors.phone.message}</p>
                )}

                <p>
                  ĐỊA CHỈ <span style={{ color: "rgb(201, 33, 39)" }}>*</span>
                </p>
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="error">{errors.address.message}</p>
                )}
                <p>GHI CHÚ</p>
                <textarea
                  placeholder="Ghi chú"
                  {...register("note")}
                ></textarea>
              </form>
            </div>

            <div
              className="carts-list"
              style={{ border: "1px solid #80808059", marginBottom: "10px" }}
            >
              {carts.length > 0 ? (
                carts.map((cart) => (
                  <CartList
                    key={cart._id}
                    cart={cart}
                    isOrderPage={true}
                    updateCart={updateCart}
                    removeFromCart={removeFromCart}
                    onUpdateTotal={handleUpdateTotal}
                  />
                ))
              ) : (
                <p style={{ textAlign: "center", margin: "100px auto" }}>
                  Không có sản phẩm nào trong giỏ hàng
                </p>
              )}
            </div>
          </div>

          <div className="col-lg-4 col-sm-12 col-12">
            <div className="cart-content-sub">
              <div className="cart-content-sub-product">
                <span>ĐƠN HÀNG</span>
              </div>
              <div className="cart-content-total">
                <p>
                  Tổng giá trị đơn hàng:
                  <span id="total-price">
                    <span id="total-price">
                      {totalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </span>
                </p>
              </div>
              <button onClick={handleSubmit(handleOrder)}>Đặt hàng</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default OrderPage;
