import jwt from "jsonwebtoken";

async function verifyAdmin(req, res, next) {
  try {
    // Lấy token từ Headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Không có token, vui lòng đăng nhập!" });
    }

    //  Giải mã token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(" Token giải mã:", decoded); //  Log kiểm tra

    //  Kiểm tra quyền admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Không có quyền truy cập" });
    }

    req.user = decoded; // Gán user vào request để dùng tiếp
    next();
  } catch (error) {
    console.error(" Lỗi xác thực admin:", error.message);
    return res.status(403).json({ error: "Xác thực thất bại!" });
  }
}

export default verifyAdmin;
