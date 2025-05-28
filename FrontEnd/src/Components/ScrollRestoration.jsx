import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Lưu vị trí scroll vào object này (key là pathname)
const scrollPositions = {};

export default function ScrollRestoration() {
  const location = useLocation();

  // 1. Lưu vị trí scroll khi rời trang
  useEffect(() => {
    // lưu vị trí scroll hiện tại vào `scrollPositions`
    return () => {
      scrollPositions[location.pathname] = window.scrollY;
      console.log(" Đã lưu scroll:", location.pathname, window.scrollY);
    };
  }, [location.pathname]);

  // 2. Khôi phục scroll khi vào trang
  useEffect(() => {
    // Đợi 100ms để trang kịp render nội dung
    const timer = setTimeout(() => {
      const savedY = scrollPositions[location.pathname];

      if (savedY !== undefined) {
        window.scrollTo(0, savedY);
        console.log(" Khôi phục scroll:", savedY);
      } else {
        window.scrollTo(0, 0); // Mặc định về đầu trang
        console.log(" Về đầu trang (chưa lưu vị trí)");
      }
    }, 100);

    return () => clearTimeout(timer); // Hủy timer nếu unmount
  }, [location.pathname]);

  return null; // Component không render gì cả
}
