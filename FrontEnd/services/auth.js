import instance from ".";

const API_URL = "http://localhost:9999/api/auth";

export const authRequestRegister = async (path, databody) => {
  try {
    const { data } = await instance.post(`${path}`, databody);

    return data.newUser;
  } catch (error) {
    alert(error?.response?.data || "Đã xảy ra lỗi.");
    return null;
  }
};

export const authRequestLogin = async (path, databody) => {
  try {
    const { data } = await instance.post(`${path}`, databody);

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("role", data.user.role);
    }

    return data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error.response?.data || error.message);

    // Trả về một object chứa lỗi để xử lý phía frontend
    return { error: error.response?.data?.error || "Đăng nhập thất bại!" };
  }
};

// Hàm lấy danh sách user
export const getAllUsers = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy token
    const response = await fetch(`${API_URL}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    return null;
  }
};

// Hàm cập nhật role user
export const updateUserRole = async (userId, newRole) => {
  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy token
    const response = await fetch(`${API_URL}/profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ role: newRole }),
    });
    return response.ok;
  } catch (error) {
    console.error("Lỗi cập nhật role user:", error);
    return false;
  }
};

// Hàm xóa user
export const deleteUser = async (userId) => {
  try {
    const accessToken = localStorage.getItem("accessToken"); // Lấy token
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    return false;
  }
};

export const authRequestForgotPassword = async (email) => {
  try {
    const { data } = await instance.post(`${API_URL}/forgot-password`, {
      email,
    });
    return data.message;
  } catch (error) {
    console.error("Lỗi gửi yêu cầu quên mật khẩu:", error);
    return null;
  }
};

export const authRequestResetPassword = async (token, password) => {
  try {
    const { data } = await instance.post(`${API_URL}/reset-password`, {
      token,
      password,
    });
    return data.message; // Trả về thông báo từ server
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    return null;
  }
};
