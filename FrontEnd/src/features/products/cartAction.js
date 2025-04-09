import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCart,
  deleteCart,
  getAllCart,
  updateCart,
} from "../../services/cartServices";

export const fetchCarts = createAsyncThunk(
  "carts/fetchCarts",
  async (userId) => {
    const response = await getAllCart(userId);
    return Array.isArray(response) ? response : response.items || [];
  }
);

export const createCart = createAsyncThunk("cart/createCarts", async (cart) => {
  return await addCart(cart);
});

const updateCartForGuest = async (cart) => {
  // Lưu trữ giỏ hàng vào local storage hoặc cập nhật state trong Redux
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

  // Cập nhật giỏ hàng
  const updatedCart = existingCart.map((item) =>
    item.productId === cart.productId
      ? { ...item, quantity: cart.quantity }
      : item
  );

  // Nếu sản phẩm không có trong giỏ hàng, thêm mới
  if (!existingCart.some((item) => item.productId === cart.productId)) {
    updatedCart.push(cart);
  }

  // Lưu giỏ hàng đã cập nhật vào local storage
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  return updatedCart; // Trả về giỏ hàng đã cập nhật
};

export const editCarts = createAsyncThunk(
  "cart/editCarts",
  async ({ userId, cartId, cart }) => {
    // Kiểm tra nếu là khách hàng
    if (!userId || !cartId) {
      console.warn(
        "Cập nhật giỏ hàng cho khách hàng, không cần userId và cartId."
      );
      // Thực hiện cập nhật giỏ hàng cho khách hàng ở đây
      return await updateCartForGuest(cart); // Giả sử bạn có một hàm để cập nhật giỏ hàng cho khách
    }

    // Nếu có userId và cartId, thực hiện cập nhật bình thường
    return await updateCart(userId, cart);
  }
);

export const removeCarts = createAsyncThunk(
  "cart/removeCarts",
  async ({ userId, productId, variantId }) => {
    if (!userId || !productId) {
      console.error("Lỗi: Thiếu userId hoặc productId khi xóa sản phẩm!");
      return { error: "Thiếu userId hoặc productId!" };
    }
    await deleteCart(userId, productId, variantId);
    return { userId, productId, variantId };
  }
);
