import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../schemas/auth";
import { authRequestRegister } from "../services/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ resolver: zodResolver(registerSchema) });

  const handleRegisterUser = async (dataBody) => {
    const { confirmPass, ...others } = dataBody;

    try {
      const data = await authRequestRegister("/auth/register", others);

      if (data) {
        toast.success("Đăng ký thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Đăng ký thất bại, vui lòng thử lại!");
        reset();
      }
    } catch (error) {
      toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
    }
  };

  return (
    <div className="form-user">
      <h2 className="header-user">Đăng Kí</h2>
      <form onSubmit={handleSubmit(handleRegisterUser)}>
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          {...register("email")}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

        <label htmlFor="username">Tên người dùng</label>
        <input
          type="text"
          id="username"
          placeholder="Tên người dùng"
          {...register("username")}
        />
        {errors.username && (
          <p style={{ color: "red" }}>{errors.username.message}</p>
        )}

        <label htmlFor="Password">Mật Khẩu</label>
        <input
          type="password"
          id="password"
          placeholder="Mật Khẩu"
          {...register("password")}
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password.message}</p>
        )}

        <label htmlFor="confirmPass">Xác Nhận Mật Khẩu</label>
        <input
          type="password"
          id="confirmPass"
          placeholder="Xác Nhận Mật Khẩu"
          {...register("confirmPass")}
        />
        {errors.confirmPass && (
          <p style={{ color: "red" }}>{errors.confirmPass.message}</p>
        )}

        <label htmlFor="phone">Số điện thoại</label>
        <input
          type="text"
          id="phone"
          placeholder="Số điện thoại"
          {...register("phone")}
        />
        {errors.phone && <p style={{ color: "red" }}>{errors.phone.message}</p>}

        <Link to="/user/login">
          <p style={{ color: "blue", textAlign: "left", marginBottom: "15px" }}>
            Bạn đã có tài khoản rồi à?
          </p>
        </Link>
        <div>
          <button className="btn-user" type="submit">
            Đăng Ký
          </button>
        </div>
      </form>
    </div>
  );
};
