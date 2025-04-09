import { useState } from "react";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS của toastify
import { authRequestForgotPassword } from "../services/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responseMessage = await authRequestForgotPassword(email);
      if (responseMessage) {
        toast.success(responseMessage);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div
      className="form-user"
      style={{
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "600px",
          height: "400px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginTop: "50px",
            marginBottom: "20px",
          }}
        >
          QUÊN MẬT KHẨU?
        </h2>
        <p
          style={{
            fontWeight: "normal",
            fontSize: "17px",
            marginBottom: "50px",
          }}
        >
          Vui lòng nhập Email của Quý Khách để đặt lại mật khẩu.
        </p>
        <input
          type="email"
          placeholder="Nhập Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          GỬI
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
