import { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetCarts } from "../features/products/cartSlice";
import { fetchCarts } from "../features/products/cartAction";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser && storedUser._id) {
      setUser(storedUser);
      dispatch(fetchCarts(storedUser._id));
    }
  }, [dispatch]);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    dispatch(fetchCarts(userData._id));
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");

    setUser(null);
    dispatch(resetCarts());
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        login,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
