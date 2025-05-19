import instance from ".";

const ORDER_URL = "/orders";

//  Tạo đơn hàng mới
export const createOrder = async (orderData) => {
  try {
    const { data } = await instance.post(ORDER_URL, orderData);
    return data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};

// Lấy danh sách đơn hàng theo userId
export const getOrdersByUserId = async (userId) => {
  try {
    const { data } = await instance.get(`${ORDER_URL}/user/${userId}`);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw error;
  }
};

//Lấy tất cả đơn hàng
export const getAllOrders = async () => {
  try {
    const { data } = await instance.get(ORDER_URL);

    console.log("Dữ liệu API trả về:", data); // Debug dữ liệu

    // Nếu API trả về object có key "orders", lấy giá trị đó
    return Array.isArray(data) ? data : data.orders || [];
  } catch (error) {
    console.error("Lỗi khi lấy tất cả đơn hàng:", error);
    return []; // Tránh lỗi .map() bị gọi trên `undefined`
  }
};

//Cập nhập trang thái đơn hàng
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log(`🛠 Gửi request đến: ${ORDER_URL}/${orderId}/status`);

    const response = await instance.patch(`${ORDER_URL}/${orderId}/status`, {
      status: newStatus,
    });

    console.log("✅ Cập nhật trạng thái thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Lỗi khi cập nhật trạng thái đơn hàng:",
      error.response?.data || error
    );
    throw error;
  }
};

//  Hủy đơn hàng
export const deleteOrder = async (orderId) => {
  try {
    console.log("Xóa đơn hàng với ID:", orderId);
    const response = await instance.delete(`${ORDER_URL}/${orderId}`);
    console.log(" Đã xóa đơn hàng:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Lỗi khi xóa đơn hàng:", error.response?.data || error);
    throw error;
  }
};

//  Xóa đơn hàng (Admin)
export const deleteOrderByAdmin = async (orderId) => {
  try {
    console.log(" Admin đang xóa đơn hàng với ID:", orderId);
    const response = await instance.delete(`${ORDER_URL}/${orderId}/admin`);
    console.log(" Đã xóa đơn hàng (Admin):", response.data);
    return response.data;
  } catch (error) {
    console.error(
      " Lỗi khi admin xóa đơn hàng:",
      error.response?.data || error
    );
    throw error;
  }
};
