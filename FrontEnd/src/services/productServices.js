import instance from ".";

export const getAllProducts = async () => {
  const { data } = await instance.get("/products");
  return data;
};

export const getById = async (id) => {
  if (!id) {
    console.error(" ID không hợp lệ:", id);
    return null;
  }

  try {
    const { data } = await instance.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.error(` Lỗi khi lấy sản phẩm ID ${id}:`, error);
    return null;
  }
};

export const getByCategory = async (categoryId) => {
  try {
    // console.log("Fetching products for category:", categoryId);
    const { data } = await instance.get(`/products?categoryId=${categoryId}`);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
    return [];
  }
};

export const addProduct = async (product) => {
  const { data } = await instance.post("/api/products", product);
  return data;
};

export const deleteProduct = async (id) => {
  if (!id) {
    console.error("Product ID is undefined");
    return false;
  }
  try {
    const res = await instance.delete(`/products/${id}`);
    return res.status === 200;
  } catch (error) {
    console.error(
      "Delete product error:",
      error.response?.data || error.message
    );
    return false;
  }
};

export const updateProduct = async (id, product) => {
  const { data } = await instance.patch(`/products/${id}`, product);

  return data;
};

export const fetchProductsBySearch = async (searchTerm) => {
  try {
    const response = await instance.get(`/products?search=${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    return [];
  }
};
