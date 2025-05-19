// import axios from "axios";

// // Cấu hình instance của axios
// const instance = axios.create({
//   baseURL: "http://127.0.0.1:9999/api", // Đảm bảo baseURL đúng
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Interceptor để thêm token vào header cho tất cả các request
// instance.interceptors.request.use(
//   (config) => {
//     // Lấy token từ localStorage
//     const accessToken = localStorage.getItem("accessToken"); // Hoặc token từ nơi bạn lưu trữ
//     if (accessToken) {
//       // Thêm token vào header Authorization
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default instance;

import axios from "axios";

// Lấy URL từ biến môi trường, VITE_API_URL được định nghĩa trong .env / .env.production
const baseURL = import.meta.env.VITE_API_URL;

// Cấu hình instance của axios
const instance = axios.create({
  baseURL, // sẽ là http://localhost:9999/api ở dev, và https://projectweb-kn0s.onrender.com/api ở prod
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào header cho tất cả các request
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
