import instance from ".";

// Lấy tất cả các variant của một sản phẩm
export const getVariantsByProductId = async (productId) => {
  try {
    const response = await instance.get(`/variants?productId=${productId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch variants:", error);
    throw error;
  }
};

// Lấy variant theo ID
export const getVariantById = async (id) => {
  try {
    const response = await instance.get(`/variants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch variant:", error);
    throw error;
  }
};

// Thêm mới variant cho một sản phẩm
export const createVariant = async (variant) => {
  try {
    console.log("Sending variant data:", variant);
    const response = await instance.post("/variants", variant);
    return response.data;
  } catch (error) {
    console.error("Failed to create variant:", error);
    throw error;
  }
};

export const updateVariant = async (variantId, variantData) => {
  try {
    if (!variantId) {
      console.error(" Lỗi: Không tìm thấy ID biến thể!");
      alert("Lỗi: Không tìm thấy ID biến thể!");
      return;
    }

    console.log("🛠 ID biến thể gửi đi:", variantId);
    console.log("📦 Dữ liệu gửi đi:", JSON.stringify(variantData, null, 2));

    // Kiểm tra định dạng dữ liệu gửi đi
    if (!variantData || typeof variantData !== "object") {
      console.error(" Dữ liệu biến thể không hợp lệ:", variantData);
      alert("Lỗi: Dữ liệu biến thể không hợp lệ!");
      return;
    }

    // Gửi request cập nhật
    const response = await instance.patch(
      `/variants/${variantId}`,
      variantData
    );

    return response.data;
  } catch (error) {
    console.error(" Lỗi cập nhật biến thể:", error.response?.data || error);

    if (error.response?.status === 404) {
      alert("Lỗi: Không tìm thấy biến thể!");
    } else {
      alert("Lỗi: Cập nhật biến thể thất bại!");
    }

    throw error;
  }
};

// Xóa variant theo ID
export const deleteVariant = async (id) => {
  try {
    const response = await instance.delete(`/variants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete variant:", error);
    throw error;
  }
};
