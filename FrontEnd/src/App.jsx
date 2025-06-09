import { Routes, Route } from "react-router-dom";
import "../src/css/style.css";
import "../src/css/grid.css";

import MainLayout from "./components/MainLayout";

import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CategoryProductList from "./pages/CategoryProductList";
import ManPage from "./pages/ManPage";
import WomanPage from "./pages/WomanPage";
import OrderPage from "./pages/OderPage";
import OrderListPage from "./pages/OrderListPage";
import DashBoardPage from "./pages/admin/DashBoardPage";
import ProductTable from "./pages/admin/ProductTable";
import ProductForm from "./pages/admin/ProductForm";
import User from "./user/User";
import LoginForm from "./user/LoginForm";
import { RegisterForm } from "./user/RegisterForm";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import NotFoundPage from "./pages/NotFoundPage";
import UserTable from "./pages/admin/UserTable";
import AdminOrders from "./pages/admin/AdminOrder";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminVariants from "./pages/admin/AdminVariants";
import AdminAttribute from "./pages/admin/AdminAttribute";

function App() {
  return (
    <>
      {/* <ScrollToTop /> */}
      <Routes>
        {/* Các trang có Header và Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<CategoryProductList />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/man" element={<ManPage />} />
          <Route path="/woman" element={<WomanPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Trang quản trị admin không dùng MainLayout */}
        <Route path="/admin" element={<DashBoardPage />}>
          <Route path="products" element={<ProductTable />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/update/:id" element={<ProductForm />} />
          <Route path="users" element={<UserTable />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="variant" element={<AdminVariants />} />
          <Route path="attribute" element={<AdminAttribute />} />
        </Route>

        {/* Các trang người dùng (không có Header/Footer) */}
        <Route path="/" element={<User />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
