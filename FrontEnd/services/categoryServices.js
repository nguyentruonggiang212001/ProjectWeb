import instance from ".";

export const getAllCategory = async () => {
  const { data } = await instance.get("/category");
  return data;
};

// export const getByIdCategory = async (id) => {
//   // Kiểm tra nếu không có id thì log lỗi và trả về null
//   if (!id) {
//     console.error("ID không hợp lệ:", id);
//     return null;
//   }

//   try {
//     const { data } = await instance.get(`/category/${id}`);
//     return data;
//   } catch (error) {
//     console.error("Lỗi khi gọi API getByIdCategory:", error);
//     return null;
//   }
// };

export const getBySlugCategory = async (slug) => {
  // Kiểm tra nếu không có slug thì log lỗi và trả về null
  if (!slug) {
    console.error("Slug không hợp lệ:", slug);
    return null;
  }

  try {
    // Mã hóa slug trước khi gửi request
    const { data } = await instance.get(`/category/slug/${slug}`);
    return data;
  } catch (error) {
    console.error("Lỗi khi gọi API getBySlugCategory:", error);
    return null;
  }
};

export const addCategory = async (category) => {
  const { data } = await instance.post("/category", category);
  return data;
};

export const deleteCategory = async (id) => {
  const res = await instance.delete(`/category/${id}`);
  return res.ok;
};

export const updateCategory = async (id, category) => {
  const { data } = await instance.patch(`/category/${id}`, category);
  return data;
};
