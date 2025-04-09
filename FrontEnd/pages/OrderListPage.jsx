import { useEffect, useState, useCallback } from "react";
import { getOrdersByUserId, deleteOrder } from "../services/orderService";
import OrderItem from "./OrderItem";
import box from "../img/Order.svg";
import { getById } from "../services/productServices";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  //  Lấy danh sách đơn hàng
  const fetchOrders = useCallback(async () => {
    if (!user._id) {
      alert("Bạn cần đăng nhập để xem đơn hàng!");
      return;
    }

    setLoading(true);
    try {
      const data = await getOrdersByUserId(user._id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  //  Lấy thông tin sản phẩm của tất cả đơn hàng
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productMap = {};
        const fetchPromises = orders.flatMap((order) =>
          order.items.map(async (item) => {
            if (!productMap[item.productId]) {
              const product = await getById(item.productId);
              productMap[item.productId] = product;
            }
          })
        );

        await Promise.all(fetchPromises);
        setProductData(productMap);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    if (orders.length > 0) {
      fetchProducts();
    }
  }, [orders]);

  //  Tính tổng tiền đơn hàng
  const getTotalOrderPrice = (order) => {
    return order.items.reduce((total, item) => {
      let price = Number(item.selectedVariant?.price || item.price || 0);
      const product = productData[item.productId];
      const categoryTitle = product?.categoryId?.title || "Không xác định";

      if (categoryTitle === "Sale") {
        price *= 0.5; // Giảm giá 50% nếu là sản phẩm Sale
      }

      return total + price * (item.quantity || 1);
    }, 0);
  };

  const cancelOrder = async (orderId) => {
    const lastCancelTime = localStorage.getItem(`lastCancelTime_${user._id}`);
    const now = Date.now();

    if (lastCancelTime && now - lastCancelTime < 15 * 60 * 1000) {
      alert("Bạn chỉ có thể hủy đơn hàng tiếp theo sau 15 phút.");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      try {
        await deleteOrder(orderId);
        alert("Đơn hàng đã được hủy!");
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );

        // Lưu thời gian hủy vào localStorage theo userId
        localStorage.setItem(`lastCancelTime_${user._id}`, now);
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        alert("Không thể hủy đơn hàng!");
      }
    }
  };

  if (loading) return <p>Đang tải danh sách đơn hàng...</p>;

  return (
    <div className="container">
      <h2
        style={{
          marginTop: "200px",
          textAlign: "center",
          fontWeight: "700",
          fontSize: "20px",
        }}
      >
        TẤT CẢ ĐƠN HÀNG
      </h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <img src={box} alt="box" style={{ marginBottom: "20px" }} />
          <p style={{ fontWeight: "normal" }}>Đơn hàng trống</p>
        </div>
      ) : (
        <div className="row" style={{ marginTop: "50px" }}>
          <div className="col-lg-3 col-sm-12 col-12">
            <div className="cart-content-sub">
              <span className="username">
                <i
                  style={{
                    backgroundColor: "#ddd",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "40px",
                    color: "white",
                    marginRight: "10px",
                  }}
                  className="fa-solid fa-user"
                ></i>
                Xin chào, {user.username || "Người dùng"}
              </span>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button>Đơn hàng của tôi</button>
              </div>
            </div>
          </div>

          <div
            className="col-lg-9 col-sm-12 col-12"
            style={{ border: "1px solid #80808059", marginBottom: "10px" }}
          >
            <ul>
              {orders.map((order) => (
                <li key={order._id} style={{ padding: "10px" }}>
                  <div className="order-list">
                    <p>
                      <strong>Họ tên:</strong> {order.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.email}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {order.address}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      <span
                        style={{
                          color:
                            order.status === "Chưa giao hàng" ? "red" : "green",
                        }}
                      >
                        {order.status}
                      </span>
                    </p>

                    <p>
                      <strong>Sản phẩm đã đặt:</strong>
                    </p>
                    <ul>
                      {order.items.map((item) => (
                        <OrderItem key={item._id} item={item} />
                      ))}
                    </ul>

                    <p>
                      <strong>Tổng tiền đơn hàng:</strong>{" "}
                      {getTotalOrderPrice(order).toLocaleString()}₫
                    </p>
                    <p>
                      <strong>Thời gian đặt hàng:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>

                    {order.status === "Chưa giao hàng" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="cancel-order-btn"
                      >
                        Hủy Đơn Hàng
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
