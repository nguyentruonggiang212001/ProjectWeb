import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  removeProduct,
} from "../../features/products/productAction";
import { Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AdminDashboard = () => {
  const { products, loading, error } = useSelector((state) => state.products);
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const dispatch = useDispatch();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
      dispatch(fetchProducts());
    }
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm không?")) {
      dispatch(removeProduct(id));
    }
  };

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

  // Lấy danh sách sản phẩm cần hiển thị
  const displayedProducts = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          Danh Sách Sản Phẩm Tokyo Life
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Giá</th>
                  <th>Mô Tả</th>
                  <th style={{ minWidth: "120px", textAlign: "center" }}>
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.title}</td>
                    <td>{item.basePrice.toLocaleString("vi-VN")}đ</td>
                    <td>{item.description}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{
                            color: "red",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <DeleteIcon />
                        </button>
                        <Link to={`/admin/products/update/${item._id}`}>
                          <button
                            style={{
                              color: "blue",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <EditIcon />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length > rowsPerPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    border: "none",
                    marginRight: "10px",
                    cursor: page === 0 ? "not-allowed" : "pointer",
                    opacity: page === 0 ? 0.5 : 1,
                  }}
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                >
                  Trước
                </button>
                <span style={{ margin: "8px 10px", fontWeight: "bold" }}>
                  Trang {page + 1}/{Math.ceil(products.length / rowsPerPage)}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * rowsPerPage >= products.length}
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    border: "none",
                    marginLeft: "10px",
                    cursor:
                      (page + 1) * rowsPerPage >= products.length
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      (page + 1) * rowsPerPage >= products.length ? 0.5 : 1,
                  }}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
