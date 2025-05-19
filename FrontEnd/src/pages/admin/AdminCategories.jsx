import React, { useEffect, useState } from "react";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "./../../services/categoryServices";
import CategoryModal from "./CategoryModal";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.role || user.role !== "admin") {
      setIsAuthorized(false);
      return;
    }
    fetchCategories();
  }, [user.role]);

  const fetchCategories = async () => {
    const data = await getAllCategory();
    setCategories(data.data);
    setLoading(false);
  };

  // Mở modal để thêm danh mục mới
  const handleAddCategory = () => {
    setCategoryTitle(""); // Xóa nội dung tiêu đề (vì đang thêm mới)
    setEditingCategory(null); // Đảm bảo không có danh mục nào đang chỉnh sửa
    setIsModalOpen(true); // Hiển thị modal
  };

  // Mở modal để chỉnh sửa danh mục
  const handleEditCategory = (category) => {
    setCategoryTitle(category.title); // Hiển thị tiêu đề của danh mục cần sửa
    setEditingCategory(category); // Lưu thông tin danh mục đang chỉnh sửa
    setIsModalOpen(true); // Hiển thị modal
  };

  // Lưu danh mục mới hoặc cập nhật danh mục cũ
  const handleSaveCategory = async () => {
    if (!categoryTitle.trim()) {
      alert("Tên danh mục không được để trống!"); // Kiểm tra nếu tiêu đề rỗng
      return;
    }

    if (editingCategory) {
      // Nếu đang chỉnh sửa, gửi yêu cầu cập nhật danh mục có sẵn
      await updateCategory(editingCategory._id, { title: categoryTitle });
    } else {
      // Nếu không có danh mục đang chỉnh sửa, tạo danh mục mới
      await addCategory({ title: categoryTitle });
    }

    setIsModalOpen(false); // Đóng modal sau khi lưu
    fetchCategories(); // Tải lại danh sách danh mục sau khi cập nhật
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  if (!isAuthorized) {
    return (
      <h2 style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
        Bạn không có quyền vào trang này!
      </h2>
    );
  }

  if (loading)
    return <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>;

  return (
    <div className="container">
      <h2
        style={{
          textAlign: "center",
          margin: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Quản lý danh mục
      </h2>

      <button
        onClick={handleAddCategory}
        style={{
          padding: "10px 15px",
          margin: "5px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
          border: "none",
          background: "#007bff",
          color: "white",
        }}
      >
        ➕ Thêm danh mục
      </button>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                textAlign: "left",
                background: "#f8f9fa",
              }}
            >
              ID
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                textAlign: "left",
                background: "#f8f9fa",
              }}
            >
              Tên danh mục
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                textAlign: "left",
                background: "#f8f9fa",
              }}
            >
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {category._id}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                {category.title}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => handleEditCategory(category)}
                  style={{
                    background: "#ffc107",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        title={categoryTitle}
        setTitle={setCategoryTitle}
      />
    </div>
  );
};

export default AdminCategories;
