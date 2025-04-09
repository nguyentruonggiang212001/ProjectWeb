import React, { useEffect, useState } from "react";

import {
  getAllAttributes,
  deleteAttribute,
} from "../../services/attributeService";
import AttributeModal from "./AdtributeModal";

const AdminAttribute = () => {
  const [attributes, setAttributes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role !== "admin") {
      setIsAuthorized(false);
      return;
    }
    fetchAttributes();
  }, []);

  if (!isAuthorized) {
    return (
      <h2 style={{ textAlign: "center", color: "red" }}>
        Bạn không có quyền vào trang này!
      </h2>
    );
  }

  const fetchAttributes = async () => {
    try {
      const data = await getAllAttributes();
      setAttributes(data);
    } catch (error) {
      console.error("Lỗi khi lấy thuộc tính:", error);
    }
  };

  const openModal = (attribute = null) => {
    setEditingAttribute(attribute);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAttribute(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await deleteAttribute(id);
        fetchAttributes();
      } catch (error) {
        console.error("Lỗi khi xóa thuộc tính:", error);
      }
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", margin: "80px" }}>
        Quản lý Thuộc tính
      </h2>
      <button
        style={{
          marginBottom: "30px",
          padding: "10px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
        onClick={() => openModal()}
      >
        Thêm Thuộc tính
      </button>
      <table border="1">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Giá trị</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((attr) => (
            <tr key={attr._id}>
              <td>{attr.name}</td>
              <td>{attr.values.join(", ")}</td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    onClick={() => openModal(attr)}
                    style={{
                      backgroundColor: "#FFA500",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(attr._id)}
                    style={{
                      backgroundColor: "#FF5733",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <AttributeModal
          attribute={editingAttribute}
          onClose={closeModal}
          refreshAttributes={fetchAttributes}
        />
      )}
    </div>
  );
};

export default AdminAttribute;
