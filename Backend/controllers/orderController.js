import Cart from "../models/Cart.js";
import Order from "../models/Oder.js";
import Variant from "../models/Variant.js";
import mongoose from "mongoose";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      console.warn(" Không có đơn hàng nào!");
      return res.status(200).json({ message: "Chưa có đơn hàng nào!" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(" Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, fullName, email, phone, address, note } = req.body;

    console.log(" Nhận yêu cầu tạo đơn hàng:", {
      userId,
      fullName,
      email,
      phone,
      address,
      note,
    });

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !fullName || !email || !phone || !address) {
      console.error(" Lỗi: Thiếu thông tin đặt hàng!");
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Lấy giỏ hàng của user
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      console.warn(" Giỏ hàng trống, không thể tạo đơn hàng!");
      return res.status(400).json({ error: "Giỏ hàng trống!" });
    }

    // Tạo danh sách sản phẩm trong đơn hàng
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.price,
    }));

    // Kiểm tra và cập nhật tồn kho của biến thể
    for (const item of orderItems) {
      const variant = await Variant.findById(item.variantId);

      if (!variant) {
        console.error(` Biến thể ${item.variantId} không tồn tại!`);
        return res.status(400).json({ error: "Biến thể không tồn tại!" });
      }

      if (variant.stock < item.quantity) {
        console.warn(` Biến thể không đủ hàng!`);
        return res.status(400).json({ error: `Biến thể không đủ hàng!` });
      }

      // Giảm số lượng tồn kho của biến thể
      variant.stock -= item.quantity;
      await variant.save();
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      userId,
      fullName,
      email,
      phone,
      address,
      note,
      items: orderItems,
      totalPrice: cart.totalPrice,
      status: "Chưa giao hàng",
    });

    await newOrder.save();

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Đặt hàng thành công!", order: newOrder });
  } catch (error) {
    console.error(" Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(` Đang tìm đơn hàng với ID: ${orderId}`);

    const order = await Order.findById(orderId);
    if (!order) {
      console.warn(" Không tìm thấy đơn hàng!");
      return res.status(404).json({ error: "Đơn hàng không tồn tại!" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(" Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(` Lấy danh sách đơn hàng của user: ${userId}`);

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      console.warn(" Không có đơn hàng nào!");
      return res.status(200).json({ message: "Bạn chưa có đơn hàng nào!" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(" Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ từ orderSchema
    if (!Order.schema.path("status").enumValues.includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ!" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "ID đơn hàng không hợp lệ!" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại!" });
    }

    res.status(200).json({ message: "Cập nhật trạng thái thành công!", order });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log(" Nhận yêu cầu hủy đơn hàng:", orderId);

    // Kiểm tra đơn hàng có tồn tại không
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại!" });
    }

    // In log để kiểm tra trạng thái thực tế
    console.log(" Trạng thái đơn hàng thực tế:", order.status);

    // Chỉ cho phép hủy đơn hàng nếu chưa giao hàng (Chuẩn hóa chữ thường & xoá khoảng trắng)
    if (order.status.trim().toLowerCase() !== "chưa giao hàng") {
      return res.status(400).json({
        error: "Chỉ có thể hủy đơn hàng khi trạng thái là 'Chưa Giao Hàng'!",
      });
    }

    // Hoàn trả số lượng stock của từng biến thể trong đơn hàng
    for (const item of order.items) {
      const variant = await Variant.findById(item.variantId);
      if (variant) {
        variant.stock += item.quantity; // Cộng lại số lượng đã đặt
        await variant.save();
      }
    }

    // Xóa đơn hàng sau khi hoàn kho
    await Order.findByIdAndDelete(orderId);
    console.log("  Đơn hàng đã được hủy và kho hàng đã được cập nhật!");

    res
      .status(200)
      .json({ message: "Đơn hàng đã được hủy và kho hàng đã được cập nhật!" });
  } catch (error) {
    console.error("  Lỗi khi hủy đơn hàng:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrderByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const adminId = req.user.id; // Lấy ID của admin đang đăng nhập

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Đơn hàng không tồn tại!" });
    }

    // Nếu đơn hàng này không phải do admin hiện tại tạo, không được xóa
    if (order.adminId && order.adminId.toString() !== adminId) {
      return res
        .status(403)
        .json({ error: "Bạn không thể xóa đơn hàng của admin khác!" });
    }

    // Hoàn trả số lượng stock của từng biến thể trong đơn hàng
    for (const item of order.items) {
      const variant = await Variant.findById(item.variantId);
      if (variant) {
        variant.stock += item.quantity; // Cộng lại số lượng đã đặt
        await variant.save();
      }
    }

    await Order.findByIdAndDelete(orderId);
    res
      .status(200)
      .json({ message: "Đơn hàng đã bị xóa và kho hàng đã được cập nhật!" });
  } catch (error) {
    console.error(" Lỗi khi xóa đơn hàng:", error);
    res.status(500).json({ error: error.message });
  }
};
