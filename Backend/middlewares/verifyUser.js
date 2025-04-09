import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function verifyUser(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const accessToken = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ error: "Không được phép, token không hợp lệ" });
    }
  } else {
    res.status(401).json({ error: "Không có token" });
  }
}

export default verifyUser;
