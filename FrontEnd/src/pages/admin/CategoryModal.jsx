import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";

Modal.setAppElement("#root");

const CategoryModal = ({ isOpen, onClose, onSave, title, setTitle }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          width: "400px",
          padding: "20px",
          borderRadius: "10px",
          background: "white",
          position: "relative",
          top: "auto",
          left: "auto",
          right: "auto",
          bottom: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        {title ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      </h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tên danh mục"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={onSave}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Lưu
        </button>
        <button
          onClick={onClose}
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Hủy
        </button>
      </div>
    </Modal>
  );
};

CategoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
};

export default CategoryModal;
