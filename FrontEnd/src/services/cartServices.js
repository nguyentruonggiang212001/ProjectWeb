// import instance from ".";

// export const getAllCart = async (id) => {
//   const { data } = await instance.get(`carts?userId=${id}`);
//   return data;
// };

// export const getByIdCart = async (id) => {
//   const { data } = await instance.get(`/carts/${id}`);
//   return data;
// };

// export const getByCategory = async (category) => {
//   try {
//     const { data } = await instance.get(`/carts?category=${category}`);
//     return data;
//   } catch (error) {
//     console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
//     return [];
//   }
// };

// export const addCart = async (product) => {
//   const { data } = await instance.post("/carts", product);
//   return data;
// };

// export const deleteCart = async (id) => {
//   try {
//     const res = await instance.delete(`/carts/${id}`);
//     return res.status === 200;
//   } catch (error) {
//     console.error("Lỗi khi xóa giỏ hàng:", error);
//     return false;
//   }
// };

// export const updateCart = async (id, cart) => {
//   const { data } = await instance.patch(`/carts/${id}`, cart);
//   return data;
// };

import instance from ".";

export const getAllCart = async (userId) => {
  // console.log(" userId khi gọi API:", userId);

  if (!userId) {
    console.error(" userId bị undefined hoặc null!");
    return null;
  }

  try {
    const { data } = await instance.get(`/cart/${userId}`);
    // console.log("📦 Kết quả API giỏ hàng:", data);
    return data;
  } catch (error) {
    console.error(" Lỗi khi lấy giỏ hàng:", error);
    return null;
  }
};

export const addCart = async (cartData) => {
  if (!cartData?.userId || !cartData?.productId || !cartData?.quantity) {
    return { error: "Dữ liệu không hợp lệ!" };
  }

  try {
    const response = await instance.post("/cart/add", cartData);

    //  Kiểm tra nếu API không trả về `cart`
    if (!response.data || !response.data.cart) {
      console.error(" Lỗi: API không trả về giỏ hàng hợp lệ!", response.data);
      return { error: "Dữ liệu không hợp lệ!" };
    }

    return response.data;
  } catch (error) {
    console.error(" Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    return error?.response?.data || { error: "Lỗi không xác định" };
  }
};

export const updateCart = async (userId, cart) => {
  console.log(" Gửi request cập nhật giỏ hàng:", JSON.stringify(cart, null, 2));

  if (!userId || !cart.productId || !cart.variantId) {
    console.error(" Lỗi: Thiếu userId, productId hoặc variantId!");
    return { error: "Dữ liệu không hợp lệ!" };
  }

  try {
    const { data } = await instance.put(`/cart/${userId}/update`, cart, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(data);
    return data.cart;
  } catch (error) {
    console.error(" Lỗi khi cập nhật giỏ hàng:", error.response?.data || error);
    return error?.response?.data || { error: "Lỗi không xác định" };
  }
};

export const deleteCart = async (userId, productId, variantId) => {
  if (!userId) {
    console.error(" Thiếu userId khi gọi API xóa giỏ hàng!");
    return false;
  }

  //  Đảm bảo `productId` là string ID
  const formattedProductId =
    typeof productId === "object" ? productId._id : productId;

  try {
    console.log(" Gửi request xóa sản phẩm:", {
      userId,
      productId: formattedProductId,
      variantId,
    });

    const { status } = await instance.delete(`/cart/${userId}/remove`, {
      data: { productId: formattedProductId, variantId },
      headers: { "Content-Type": "application/json" },
    });

    return status === 200;
  } catch (error) {
    console.error(" Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return false;
  }
};
