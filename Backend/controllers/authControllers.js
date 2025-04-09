import User from "./../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";
import env from "../config/config.env.js";

// Tạo JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, username, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      phone,
      role: role ? role : "member",
    });

    try {
      const mail = await sendEmail(email, "aloha", "olaho");
    } catch (error) {
      console.log(error);
    }
    res
      .status(201)
      .json({ message: "Đăng ký thành công, hãy xác thực email", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }

    const isMatch = bcryptjs.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Sai tài khoản hoặc mật khẩu" });
    }
    const accessToken = generateToken(user);

    res.json({
      message: "Đăng nhập thành công",
      accessToken,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật role user (chỉ admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Kiểm tra ID có hợp lệ không
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ error: "User không tồn tại" });
    }

    // Kiểm tra quyền admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền cập nhật role" });
    }

    // Không cho phép thay đổi quyền của admin khác
    if (userToUpdate.role === "admin") {
      return res.status(403).json({ error: "Không thể chỉnh sửa admin khác" });
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    res.status(200).json({ message: "Cập nhật thành công", userToUpdate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User không tồn tại" });
    }

    // Chỉ admin mới có thể xóa user khác
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Bạn không có quyền xóa user này" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server, thử lại sau" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Tạo token có hạn 30 phút
    const token = jwt.sign({ id: user._id }, env.SECRET_KEY, {
      expiresIn: "30m",
    });

    // Lưu token vào database
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    // Tạo link reset mật khẩu
    const resetLink = `${env.CLIENT_URL}/reset-password?token=${token}`;
    console.log("Reset link:", resetLink); // Debug để kiểm tra link có đúng không

    await sendEmail(
      email,
      "Đặt lại mật khẩu",
      `Click vào link để đặt lại mật khẩu: ${resetLink}`
    );

    return res
      .status(200)
      .json({ message: "Hãy kiểm tra Email để đặt lại mật khẩu" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    //  Kiểm tra token có hợp lệ không
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    //  Tìm user theo decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    //  Kiểm tra thời gian hết hạn của token
    if (user.resetTokenExpire < Date.now()) {
      return res
        .status(400)
        .json({ message: "Token đã hết hạn, vui lòng yêu cầu lại" });
    }

    //  Mã hóa mật khẩu mới
    user.password = bcryptjs.hashSync(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    console.error(" Lỗi resetPassword:", error);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại" });
  }
};
