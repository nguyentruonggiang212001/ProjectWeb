import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ProjectWeb/", //  thêm dòng này
  build: {
    sourcemap: false, // Tắt sourcemap nếu bạn muốn giữ như cũ
  },
});
