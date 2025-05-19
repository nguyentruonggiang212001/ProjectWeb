import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  removeProduct,
} from "../../features/products/productAction";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditVariantModal from "./VariantModal";

const AdminVariant = () => {
  const { products, loading, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
      dispatch(fetchProducts());
    }
  }, [dispatch]);
  if (!isAdmin) {
    return (
      <h3
        style={{
          color: "red",
          textAlign: "center",
          marginTop: "20px",
          fontSize: "20px",
        }}
      >
        Bạn không có quyền truy cập trang này!
      </h3>
    );
  }
  // Phân trang
  const productsPerPage = 10;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      dispatch(removeProduct(id));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "25px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Quản Lý Biến Thể Sản Phẩm
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      ) : (
        <>
          <table className="container">
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  ID
                </th>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  Tên Sản Phẩm
                </th>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product._id}>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {product._id}
                  </td>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {product.title}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <button
                      style={{
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#4CAF50",
                        color: "white",
                      }}
                      onClick={() => handleEditClick(product)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      style={{
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#f44336",
                        color: "white",
                      }}
                      onClick={() => handleDelete(product._id)}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <button
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Trước
            </button>
            <span style={{ fontSize: "16px" }}>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Tiếp
            </button>
          </div>
        </>
      )}
      {openModal && selectedProduct && (
        <EditVariantModal
          product={selectedProduct}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default AdminVariant;
