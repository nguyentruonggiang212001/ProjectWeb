import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { addAttribute, updateAttribute } from "../../services/attributeService";

const ITEMS_PER_PAGE = 5; // Số giá trị hiển thị mỗi trang

const AttributeModal = ({ attribute, onClose, refreshAttributes }) => {
  const [formData, setFormData] = useState({ name: "", values: [] });
  const [newValue, setNewValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (attribute) {
      setFormData({ ...attribute });
    } else {
      setFormData({ name: "", values: [] });
    }
    setCurrentPage(1); // Reset về trang đầu tiên khi mở modal
  }, [attribute]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddValue = async () => {
    if (newValue.trim()) {
      const updatedValues = [...formData.values, newValue.trim()];
      setFormData({ ...formData, values: updatedValues });
      setNewValue("");

      if (attribute?._id) {
        try {
          await updateAttribute(attribute._id, {
            ...formData,
            values: updatedValues,
          });
          refreshAttributes();
        } catch (error) {
          alert("Không thể cập nhật thuộc tính!");
        }
      }
    }
  };

  const handleRemoveValue = async (index) => {
    if (window.confirm("Bạn có chắc muốn xóa giá trị này không?")) {
      const updatedValues = formData.values.filter((_, i) => i !== index);
      setFormData({ ...formData, values: updatedValues });

      if (attribute?._id) {
        try {
          await updateAttribute(attribute._id, {
            ...formData,
            values: updatedValues,
          });
          refreshAttributes();
        } catch (error) {
          alert("Không thể cập nhật thuộc tính!");
        }
      }
    }
  };

  const handleSave = async () => {
    try {
      if (attribute?._id) {
        await updateAttribute(attribute._id, formData);
      } else {
        await addAttribute(formData);
      }
      alert("Lưu thành công!");
      refreshAttributes();
      onClose();
    } catch (error) {
      alert("Có lỗi xảy ra!");
    }
  };

  // Phân trang danh sách giá trị
  const totalPages = Math.ceil(formData.values.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedValues = formData.values.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          maxWidth: "90%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
          {attribute ? "Chỉnh sửa Thuộc tính" : "Thêm Thuộc tính"}
        </h3>

        {/* Ô nhập giá trị mới */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Nhập giá trị mới..."
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <button
            type="button"
            onClick={handleAddValue}
            style={{
              padding: "8px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Thêm
          </button>
        </div>

        <label>Tên Thuộc tính:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        />

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px" }}>Giá trị</th>
              <th style={{ textAlign: "right", padding: "8px" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedValues.map((value, index) => (
              <tr key={startIndex + index}>
                <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                  {value}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveValue(startIndex + index)}
                    style={{
                      color: "red",
                      border: "none",
                      background: "none",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Nút phân trang */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "5px 10px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Trước
            </button>
            <span style={{ margin: "10px" }}>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              style={{
                padding: "10px 15px",
                backgroundColor: "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Sau
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <button
            onClick={handleSave}
            style={{
              background: "blue",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Lưu
          </button>
          <button
            onClick={onClose}
            style={{
              background: "red",
              color: "white",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

AttributeModal.propTypes = {
  attribute: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  refreshAttributes: PropTypes.func.isRequired,
};

export default AttributeModal;
