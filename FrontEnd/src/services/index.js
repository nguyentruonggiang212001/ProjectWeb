import axios from "axios";

// Cấu hình instance của axios
const instance = axios.create({
  baseURL: "http://127.0.0.1:9999/api", // Đảm bảo baseURL đúng
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào header cho tất cả các request
instance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const accessToken = localStorage.getItem("accessToken"); // Hoặc token từ nơi bạn lưu trữ
    if (accessToken) {
      // Thêm token vào header Authorization
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
