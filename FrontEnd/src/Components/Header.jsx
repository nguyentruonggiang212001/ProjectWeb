import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/style.css";
import "../css/grid.css";
import logo from "../img/icontokyo-Photoroom.png";
import banner from "../img/banner.jpg";
import logoMobie from "../img/LogoMenuMobile.0bf1ee6a.svg";
import { AuthContext } from "../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./../features/products/productAction";
import { setSearchTerm } from "../features/products/productSlice";
import { fetchCarts } from "../features/products/cartAction";
import useDebounce from "../hook/useDebounce";
import { fetchProductsBySearch } from "../services/productServices";
import { getAllCategory } from "../services/categoryServices";

const Header = () => {
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.carts?.carts || []);
  const { user, logout } = useContext(AuthContext);
  const loading = useSelector((state) => state.products?.loading || false);
  const error = useSelector((state) => state.products?.error || null);
  const searchTerm = useSelector((state) => state.products?.searchTerm || "");
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 500);
  const [products, setProducts] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Lấy giỏ hàng tạm thời từ localStorage
  // const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
  const [guestCart, setGuestCart] = useState(
    JSON.parse(localStorage.getItem("guestCart")) || []
  );

  // Lắng nghe sự kiện storage để cập nhật guestCart
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedGuestCart =
        JSON.parse(localStorage.getItem("guestCart")) || [];
      setGuestCart(updatedGuestCart);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Tính tổng số lượng sản phẩm
  const totalCartItems = user?._id ? carts.length : guestCart.length;

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getAllCategory(); // Sử dụng service đã có

        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Tham chiếu đến ô tìm kiếm
  const searchBoxRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
    // console.log("Fetching products...");
  }, [dispatch]);

  // console.log(" Search Term:", searchTerm);
  useEffect(() => {}, [carts]);

  useEffect(() => {
    if (user?._id) {
      // console.log(" Fetching cart for user:", user._id);

      dispatch(fetchCarts(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedSearchTerm) {
        const results = await fetchProductsBySearch(debouncedSearchTerm);
        setProducts(results);
      } else {
        setProducts([]); // Xóa danh sách nếu input rỗng
      }
    };
    fetchData();
  }, [debouncedSearchTerm]);

  useEffect(() => {}, [debouncedSearchTerm]);

  // Sự kiện kiểm tra click ra ngoài để ẩn gợi ý
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target) &&
        !event.target.closest(".search-results")
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value)); //  Cập nhật Redux state
    console.log("Search Term:", e.target.value);
    setShowSearchResults(true);
  };

  const handleSelectProduct = (id) => {
    dispatch(setSearchTerm(""));
    setProducts([]); // Ẩn kết quả
    navigate(`/products/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <input type="checkbox" id="check" style={{ display: "none" }} />
      <label className="overlay" htmlFor="check"></label>
      <input type="checkbox" id="check-women" style={{ display: "none" }} />
      <input type="checkbox" id="check-men" style={{ display: "none" }} />
      <header>
        <div className="container">
          <div className="nav-header">
            <div className="img">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </div>

            {showSearchResults && (
              <div
                className="search-overlay"
                onClick={() => setShowSearchResults(false)}
              ></div>
            )}

            <div className="search-box" ref={searchBoxRef}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
                onClick={() => setShowSearchResults(true)}
              />
              <button>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>

              {showSearchResults && (
                <div className="search-results">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div
                        key={product._id}
                        className="search-result-item"
                        onClick={() => handleSelectProduct(product._id)}
                      >
                        <img
                          src={
                            product.imageUrl || "https://via.placeholder.com/40"
                          }
                          alt={product.title}
                          className="search-result-img"
                        />
                        <span>{product.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">
                      Không tìm thấy sản phẩm nào.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="header-icon">
              <div className="header-icon-cart">
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping">
                    <div>{totalCartItems}</div>
                  </i>
                </Link>
              </div>
              <div
                className="header-icon-box"
                style={{ display: user?.role === "admin" ? "block" : "none" }}
              >
                <Link to="/admin/products">
                  <i className="fa-solid fa-box"></i>
                </Link>
              </div>

              <div
                className={`header-icon-user ${
                  user?.email ? "dropdown-logged-in" : "dropdown-logged-out"
                }`}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div>
                  <i className="fa-solid fa-user"></i>
                  {showDropdown && (
                    <div
                      className={`dropdown-menu ${
                        user?.email ? "logged-in" : "logged-out"
                      }`}
                    >
                      {user?.email ? (
                        <>
                          <span className="username">
                            <i
                              style={{
                                backgroundColor: "#ddd",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "40px",
                                color: "white",
                                marginRight: "10px",
                              }}
                              className="fa-solid fa-user"
                            ></i>
                            {user.username || "Người dùng"}
                          </span>
                          <div
                            className="content-user"
                            style={{
                              borderBottom: "1px solid #ddd",
                              width: "180px",
                              margin: "5px auto",
                            }}
                          ></div>
                          <div>
                            <Link to="/orders" className="dropdown-item">
                              Đơn hàng
                              <i className="fa-solid fa-list"></i>
                            </Link>
                          </div>
                          <div>
                            <Link
                              to="/"
                              onClick={logout}
                              className="dropdown-item "
                              style={{ color: "red" }}
                            >
                              Đăng xuất
                              <i
                                className="fa-solid fa-door-open"
                                style={{ color: "red", top: "-3px" }}
                              ></i>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <p
                            style={{
                              textAlign: "center",
                              margin: "10px auto",
                              width: "200px",
                              lineHeight: "20px",
                            }}
                          >
                            CHÀO MỪNG QUÝ KHÁCH ĐẾN VỚI TOKYOLIFE
                          </p>
                          <span
                            style={{
                              textAlign: "center",
                              fontSize: "13px",
                              fontWeight: "200",
                            }}
                          >
                            Đăng nhập tài khoản của Quý Khách
                          </span>
                          <Link
                            to="/login"
                            className="dropdown-item dropdown-auth"
                          >
                            <button
                              style={{
                                padding: "10px 25px",
                                backgroundColor: "rgb(201, 32, 39)",
                                border: "none",
                                color: "white",
                                fontWeight: 600,
                                fontSize: "13px",
                                margin: "10px auto",
                                borderRadius: "5px",
                              }}
                            >
                              ĐĂNG NHẬP
                            </button>
                          </Link>
                          <div
                            className="content-user"
                            style={{
                              borderBottom: "1px solid #ddd",
                              width: "280px",
                              margin: "0 auto",
                            }}
                          ></div>
                          <p
                            style={{
                              textAlign: "center",
                              margin: "10px auto",
                              width: "200px",
                              lineHeight: "20px",
                            }}
                          >
                            ĐĂNG KÍ THÀNH VIÊN
                          </p>
                          <Link
                            to="/register"
                            className="dropdown-item dropdown-auth"
                          >
                            <button
                              style={{
                                padding: "10px 25px",
                                backgroundColor: "white",
                                border: "1px solid #ddd",

                                fontWeight: 600,
                                fontSize: "13px",
                                borderRadius: "5px",
                              }}
                            >
                              ĐĂNG KÝ
                            </button>
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <label className="header-icon-bar" htmlFor="check">
                <i className="fa-solid fa-bars"></i>
              </label>
            </div>
          </div>
        </div>
      </header>
      <section>
        <div className="container">
          <div className="nav-sub">
            <ul>
              <div className="img-sub">
                <img src={banner} alt="banner" className="img-sub-first" />
                <img src={logoMobie} className="img-sub-second" alt="logo" />
              </div>
              <li>
                <Link
                  onMouseEnter={(e) => (e.target.style.color = "red")}
                  onMouseLeave={(e) => (e.target.style.color = "black")}
                  to="/category/other"
                >
                  Sale
                </Link>
              </li>
              <li>
                <div className="toggle-pc">
                  <label className="toggle-label">
                    <Link
                      className="woman"
                      to="/woman"
                      onMouseEnter={(e) => (e.target.style.color = "red")}
                      onMouseLeave={(e) => (e.target.style.color = "black")}
                    >
                      Nữ
                    </Link>
                    <i
                      className="fa-solid fa-caret-down"
                      htmlFor="check-women"
                    ></i>
                  </label>
                  <div className="dropdown">
                    <div className="dropdown-girl-pc">
                      <Link to="/category/ao-khoac-phao-va-long-vu-nu">
                        ÁO KHOÁC PHAO & LÔNG VŨ NỮ
                      </Link>

                      <Link to="/category/quan-dai-and-jean-nu">
                        QUẦN DÀI & JEAN NỮ
                      </Link>
                      <Link to="/category/giay-the-thao-va-giay-chay-bo-nu">
                        GIÀY THỂ THAO & GIÀY CHẠY BỘ NỮ
                      </Link>
                      <Link to="/category/do-lot-nu">ĐỒ LÓT NỮ</Link>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="toggle-pc">
                  <label className="toggle-label">
                    <Link
                      className="man"
                      to="/man"
                      onMouseEnter={(e) => (e.target.style.color = "red")}
                      onMouseLeave={(e) => (e.target.style.color = "black")}
                    >
                      Nam
                    </Link>

                    <i className="fa-solid fa-caret-down"></i>
                  </label>
                  <div className="dropdown">
                    <div className="dropdown-boy">
                      <Link to="/category/ao-khoac-phao-va-long-vu-nam">
                        ÁO KHOÁC PHAO & LÔNG VŨ NAM
                      </Link>
                      <Link to="/category/quan-dai-va-jean-nam">
                        QUẦN DÀI & JEAN NAM
                      </Link>
                      <Link to="/category/giay-the-thao-va-giay-chay-nam">
                        GIÀY THỂ THAO & GIÀY CHẠY NAM
                      </Link>
                      <Link to="/category/do-lot-nam">ĐỒ LÓT NAM</Link>
                    </div>
                  </div>
                </div>
              </li>
              <div className="toggle-mb">
                <label htmlFor="check-women" className="toggle-label">
                  <Link
                    className="women"
                    style={{ padding: "0px" }}
                    to="/woman"
                  >
                    Nữ
                  </Link>
                  <i className="fa-solid fa-caret-down"></i>
                </label>
                <div className="dropdown-women">
                  <Link to="/category/beauty">Làm Đẹp Nữ</Link>
                  <Link to="/category/womens-dresses">Váy Nữ</Link>
                  <Link to="/category/womens-shoes">Giày Nữ</Link>
                  <Link to="/category/womens-watches">Đồng Hồ Nữ</Link>
                </div>
              </div>

              <div className="toggle-mb">
                <label htmlFor="check-men" className="toggle-label">
                  <Link className="man" style={{ padding: "0px" }} to="/man">
                    Nam
                  </Link>
                  <i className="fa-solid fa-caret-down"></i>
                </label>
                <div className="dropdown-men">
                  <Link to="/category/Áo Nam">Áo Nam</Link>
                  <Link to="/category/mens-shoes">Giày Nam</Link>
                  <Link to="/category/mens-watches">Đồng Hồ Nam</Link>
                  <Link to="/category/laptops">Laptops Nam</Link>
                </div>
              </div>
              <li>
                <Link
                  to="/category/tre-em"
                  onMouseEnter={(e) => (e.target.style.color = "red")}
                  onMouseLeave={(e) => (e.target.style.color = "black")}
                >
                  Trẻ em
                </Link>
              </li>
              <li>
                <Link
                  to="/category/kinh-ram"
                  onMouseEnter={(e) => (e.target.style.color = "red")}
                  onMouseLeave={(e) => (e.target.style.color = "black")}
                >
                  Kính Râm
                </Link>
              </li>
              <li>
                <Link
                  to="/category/nha-cua-va-doi-song"
                  onMouseEnter={(e) => (e.target.style.color = "red")}
                  onMouseLeave={(e) => (e.target.style.color = "black")}
                >
                  Nhà Cửa Và Đời Sống
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="sub">
        <div className="search-sub">
          <div className="search-box-sub" ref={searchBoxRef}>
            <input
              type="text"
              id="search-input-sub"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearch}
              onClick={() => setShowSearchResults(true)}
            />
            <button id="search-button-sub">
              <i className="fa fa-search"></i>
            </button>

            {showSearchResults && (
              <div className="search-results">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div
                      key={product._id}
                      className="search-result-item"
                      onClick={() => handleSelectProduct(product._id)}
                    >
                      <img
                        src={
                          product.imageUrl || "https://via.placeholder.com/40"
                        }
                        alt={product.title}
                        className="search-result-img"
                      />
                      <span>{product.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="no-results">Không tìm thấy sản phẩm nào.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
