import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../../services/auth";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    if (data) setUsers(data);
  };

  const handleUpdateRole = async (userId, newRole) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      alert("Cập nhật role thành công!");
      fetchUsers();
    } else {
      alert("Có lỗi xảy ra khi cập nhật role!");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa user này?")) {
      const success = await deleteUser(userId);
      if (success) {
        alert("Xóa user thành công!");
        fetchUsers();
      } else {
        alert("Có lỗi xảy ra khi xóa user!");
      }
    }
  };

  if (!isAdmin) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        Bạn không có quyền truy cập trang này!
      </h2>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <h2
          style={{
            textAlign: "center",
            margin: "100px 50px",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          Danh sách người dùng
        </h2>
        <table border="1">
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.phone ? user.phone : "Không có"}</td>
                <td>
                  {user.role === "admin" ? (
                    "admin"
                  ) : (
                    <select
                      onChange={(e) =>
                        handleUpdateRole(user._id, e.target.value)
                      }
                      defaultValue={user.role}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </td>
                <td>
                  {user.role !== "admin" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
