import instance from ".";

export const getAllAttributes = async () => {
  try {
    const response = await instance.get("/attribute"); // Kiểm tra lại route
    console.log(" API Response:", response);
    return response.data; // Kiểm tra xem response có chứa data không
  } catch (error) {
    console.error("Error fetching attributes:", error.response?.data || error);
    throw error;
  }
};

export const getByIdAttribute = async (id) => {
  // Kiểm tra nếu không có id thì log lỗi và trả về null
  if (!id) {
    console.error("ID không hợp lệ:", id);
    return null;
  }

  try {
    const { data } = await instance.get(`/attribute/${id}`);
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getByIdAttribute:", error);
    return null;
  }
};

export const addAttribute = async (attribute) => {
  const { data } = await instance.post("/attribute", attribute);
  return data;
};

export const deleteAttribute = async (id) => {
  const res = await instance.delete(`/attribute/${id}`);
  return res.ok;
};

export const updateAttribute = async (id, attribute) => {
  const { data } = await instance.put(`/attribute/${id}`, attribute);
  return data;
};
