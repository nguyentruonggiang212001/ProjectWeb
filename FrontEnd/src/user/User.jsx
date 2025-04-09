import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";

const User = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Outlet />
    </>
  );
};

export default User;
