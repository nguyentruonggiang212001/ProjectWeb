import { useForm } from "react-hook-form";
import { zodResolver } from "./../../node_modules/@hookform/resolvers/zod/src/zod";
import { NavLink, useNavigate } from "react-router-dom";
import { loginSchema } from "../schemas/auth";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { authRequestLogin } from "../services/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const Nav = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ resolver: zodResolver(loginSchema) });

  const { setUser, user } = useContext(AuthContext);

  const handleLogin = async (dataBody) => {
    try {
      const data = await authRequestLogin("/auth/login", dataBody);

      if (data.error) {
        throw new Error(data.error);
      }

      // Xóa giỏ hàng tạm thời khi đăng nhập thành công
      localStorage.removeItem("guestCart");

      // Lưu thông tin vào localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("email", data?.user?.email);
      localStorage.setItem("role", data?.user?.role);
      localStorage.setItem("user", JSON.stringify(data?.user));
      setUser(data.user);

      Nav("/");
    } catch (error) {
      console.error("Lỗi đăng nhập:", error.message);
      toast.error(error.message, { position: "top-right" });
      reset();
    }
  };

  return (
    <div className="form-user">
      <h2 className="header-user">Đăng Nhập</h2>
      <form onSubmit={handleSubmit(handleLogin)}>
        <label htmlFor="Email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p style={{ color: "red" }}>{errors.email?.message}</p>
        )}

        <label htmlFor="Password">Mật Khẩu</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Mật Khẩu"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p style={{ color: "red" }}>{errors.password?.message}</p>
        )}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <NavLink to="/register">
            <p
              type="submit"
              style={{ color: "blue", textAlign: "left", marginBottom: "10px" }}
            >
              Bạn có tài khoản chưa ?
            </p>
          </NavLink>

          <NavLink to="/forgot-password">
            <p
              style={{ color: "blue", textAlign: "left", marginBottom: "10px" }}
            >
              Quên mật khẩu?
            </p>
          </NavLink>
        </div>

        <div>
          <button type="submit" className="btn-user">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
