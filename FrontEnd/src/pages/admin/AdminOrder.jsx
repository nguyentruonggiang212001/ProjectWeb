import React, { useEffect, useState } from "react";
import {
  deleteOrderByAdmin,
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";
import { getById } from "../../services/productServices";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role !== "admin") {
      setIsAuthorized(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        if (!data) return;

        // Gán tên sản phẩm vào đơn hàng
        const ordersWithProducts = await Promise.all(
          data.map(async (order) => ({
            ...order,
            items: await Promise.all(
              order.items.map(async (item) => {
                const product = await getById(item.productId);
                return {
                  ...item,
                  productName: product?.title || "Không có tên",
                };
              })
            ),
          }))
        );

        setOrders(ordersWithProducts);
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user.role]);

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;

    try {
      await deleteOrderByAdmin(orderId);
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Lỗi khi admin xóa đơn hàng:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (
      !window.confirm(
        `Xác nhận cập nhật trạng thái đơn hàng thành "${newStatus}"?`
      )
    )
      return;

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  if (!isAuthorized) {
    return (
      <h2 style={{ textAlign: "center", color: "red" }}>
        Bạn không có quyền vào trang này!
      </h2>
    );
  }

  if (loading) return <p>Đang tải dữ liệu...</p>;

  if (orders.length === 0) {
    return (
      <h2
        style={{
          textAlign: "center",
          color: "gray",
          marginTop: "200px",
          fontSize: "30px",
        }}
      >
        Không có đơn hàng nào.
      </h2>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "1600px" }}>
      <h2
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "25px",
          fontWeight: "bold",
        }}
      >
        Quản lý đơn hàng
      </h2>
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        style={{
          width: "100%",
          marginTop: "20px",
          textAlign: "left",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f2f2f2",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <th>Mã đơn hàng</th>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order._id}
              style={{
                backgroundColor: "#fff",
                borderBottom: "1px solid #ddd",
              }}
            >
              <td>{order._id}</td>
              <td>{order.fullName}</td>
              <td>{order.address}</td>
              <td>
                <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <li key={item._id}>
                        {item.productName || "Không có tên"} - SL:{" "}
                        {item.quantity} - Giá: {item.price?.toLocaleString()}đ
                      </li>
                    ))
                  ) : (
                    <li>Không có sản phẩm</li>
                  )}
                </ul>
              </td>
              <td>
                {order.totalPrice
                  ? order.totalPrice.toLocaleString() + "đ"
                  : "N/A"}
              </td>
              <td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  style={{
                    padding: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    minWidth: "140px",
                  }}
                >
                  <option value="Chưa giao hàng">Chưa giao hàng</option>
                  <option value="Đang vận chuyển">Đang vận chuyển</option>
                  <option value="Đã giao hàng">Đã giao hàng</option>
                  <option value="Đã hủy đơn hàng">Đã hủy đơn hàng</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
