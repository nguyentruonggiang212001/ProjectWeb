import { Routes, Route } from "react-router-dom";
import "../src/css/style.css";
import "../src/css/grid.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
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
import LoginForm from "./user/LoginForm";
import { RegisterForm } from "./user/RegisterForm";
import User from "./user/User";
import ScrollToTop from "react-scroll-to-top";
import NotFoundPage from "./pages/NotFoundPage";
import UserTable from "./pages/admin/UserTable";
import AdminOrders from "./pages/admin/AdminOrder";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminVariants from "./pages/admin/AdminVariants";
import AdminAttribute from "./pages/admin/AdminAttribute";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Các trang có Header và Footer */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <>
              <Header />
              <CategoryProductList />
              <Footer />
            </>
          }
        />

        <Route
          path="/products/:id"
          element={
            <>
              <Header />
              <ProductDetailPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/man"
          element={
            <>
              <Header />
              <ManPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/woman"
          element={
            <>
              <Header />
              <WomanPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Header />
              <CartPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/order"
          element={
            <>
              <Header />
              <OrderPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Header />
              <OrderListPage />
              <Footer />
            </>
          }
        />

        {/* Trang quản trị admin */}
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

        {/* Các trang trong /user KHÔNG có Header và Footer */}
        <Route path="/" element={<User />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Trang 404 */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <NotFoundPage />
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
