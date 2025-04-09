import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authRequestResetPassword } from "../services/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Lấy token từ URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const responseMessage = await authRequestResetPassword(token, password);
      if (responseMessage) {
        toast.success(responseMessage);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
    }
  };

  return (
    <div className="form-user">
      <form onSubmit={handleSubmit} style={{ height: "300px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "25px",
            marginBottom: "50px",
          }}
        >
          Đặt Lại Mật Khẩu
        </h2>
        <label style={{ marginBottom: "20px" }}>Mật khẩu mới</label>
        <input
          style={{ marginBottom: "20px" }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới"
          required
        />
        <button
          type="submit"
          style={{
            backgroundColor: " #4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Xác Nhận
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
