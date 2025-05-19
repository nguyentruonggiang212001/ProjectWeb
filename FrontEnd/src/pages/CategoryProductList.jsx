import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Slider } from "antd";
import "../css/category.css";
import { fetchProducts } from "../features/products/productAction";
import productContent from "../img/cart-content.svg";
import { getBySlugCategory } from "../services/categoryServices";

const CategoryProductList = ({ slug: propSlug }) => {
  // const { slug } = useParams(); // Lấy slug từ URL
  const { slug: urlSlug } = useParams();
  const slug = propSlug || urlSlug; // Ưu tiên propSlug, nếu không có thì lấy từ URL
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isCategoryPage = location.pathname.startsWith("/category");
  const allProducts = useSelector((state) => state.products?.products || []);
  const [visibleProducts, setVisibleProducts] = useState(4);
  const [sortOption, setSortOption] = useState("all");
  const [selectedColor, setSelectedColor] = useState(null);

  //  Tìm giá cao nhất theo danh mục
  // const maxProductPrice = Math.max(...products.map((p) => p.basePrice), 0);
  const maxProductPrice = Math.max(
    ...products.map((p) => {
      // Kiểm tra nếu sản phẩm có title là "Other"
      const isSale = p.categoryId?.title === "Other"; // Sử dụng categoryId để kiểm tra
      return isSale ? p.basePrice * 0.5 : p.basePrice; // Lấy giá đã giảm nếu là sản phẩm Sale
    }),
    0
  );
  console.log("gia cua maxPrice", maxProductPrice);

  const [priceRange, setPriceRange] = useState([0, maxProductPrice]);

  //  Fetch lại sản phẩm nếu Redux Store rỗng
  useEffect(() => {
    if (allProducts.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, allProducts.length]);

  //  Reset khoảng giá khi thay đổi danh mục
  useEffect(() => {
    setPriceRange([0, maxProductPrice]);
    setVisibleProducts(4); // Reset số sản phẩm hiển thị khi thay đổi danh mục
  }, [category, maxProductPrice]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getBySlugCategory(slug);
        if (response?.category) {
          setCategory(response.category);
          setProducts(response.category.products);

          // Tính giá cao nhất để thiết lập khoảng giá
          const maxPrice = Math.max(
            ...response.category.products.map((p) => {
              const isSale = p.categoryId?.title === "Other"; // Kiểm tra title
              return isSale ? p.basePrice * 0.5 : p.basePrice; // Lấy giá đã giảm nếu là sản phẩm Sale
            }),
            0
          );
          setPriceRange([0, maxPrice]); // Cập nhật khoảng giá
        } else {
          setError("Danh mục không tồn tại");
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  if (loading) return <p style={{ textAlign: "center" }}>Đang tải...</p>;
  if (!products || products.length === 0)
    return (
      <p style={{ textAlign: "center", color: "red" }}>Không có sản phẩm nào</p>
    );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount).replace(/\./g, ",");

  //  Lọc sản phẩm theo màu sắc
  const filteredByColor = selectedColor
    ? products.filter((p) => {
        const productColors = p.variants?.map(
          (v) =>
            v.attributes?.find((attr) => attr.attributeId?.name === "Color")
              ?.value
        );
        return productColors?.includes(selectedColor);
      })
    : products;

  const filteredByColorAndPrice = filteredByColor.filter((p) => {
    const isSale = p.categoryId?.title === "Other";
    const priceToCheck = isSale ? p.basePrice * 0.5 : p.basePrice;
    return priceToCheck >= priceRange[0] && priceToCheck <= priceRange[1];
  });

  // Lấy số sản phẩm hiển thị
  const displayedProducts = filteredByColorAndPrice.slice(0, visibleProducts);

  //  Sắp xếp sản phẩm đang hiển thị
  const sortedDisplayedProducts = [...displayedProducts].sort((a, b) => {
    switch (sortOption) {
      case "a-z":
        return a.title.localeCompare(b.title);
      case "z-a":
        return b.title.localeCompare(a.title);
      case "low-high":
        return a.basePrice - b.basePrice;
      case "high-low":
        return b.basePrice - a.basePrice;
      default:
        return 0;
    }
  });

  // Nút "Xem thêm"
  const handleShowMore = () =>
    setVisibleProducts((prev) =>
      Math.min(prev + 4, filteredByColorAndPrice.length)
    );

  return (
    <div className="container" style={{ userSelect: "none" }}>
      <div className={isCategoryPage ? "category-page" : "homepage"}>
        <div className="category-product-list">
          <div
            className="product-list"
            style={{ display: "flex", gap: "10px" }}
          >
            {isCategoryPage && (
              <div
                className="filters"
                style={{
                  marginTop: "20px",
                  width: "200px",
                  fontWeight: "600",
                }}
              >
                <div
                  className="price-filter"
                  style={{ marginBottom: "20px", width: "200px" }}
                >
                  <label>Sắp xếp khoảng giá:</label>
                  <Slider
                    range
                    min={0}
                    max={maxProductPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                  />

                  <div
                    className="price-content"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{formatCurrency(priceRange[0])} </span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>

                <div className="option">
                  <label>
                    Sắp xếp sản phẩm:
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="all">Tất cả</option>
                      <option value="a-z">Tên (A - Z)</option>
                      <option value="z-a">Tên (Z - A)</option>
                      <option value="low-high">Giá (Thấp - Cao)</option>
                      <option value="high-low">Giá (Cao - Thấp)</option>
                    </select>
                  </label>
                </div>
                <div className="color-filter">
                  <p>Lọc sản phẩm theo màu:</p>
                  {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                    <div
                      key={color}
                      onClick={() =>
                        setSelectedColor(selectedColor === color ? null : color)
                      }
                      style={{
                        display: "inline-block",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        margin: "5px",
                        cursor: "pointer",
                        backgroundColor: color.toLowerCase(),
                        border:
                          selectedColor === color
                            ? "2px solid black"
                            : "1px solid #ddd",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            <div
              className="row"
              style={{
                width: filteredByColorAndPrice.length <= 2 ? "1000px" : "auto",
                margin: "0 auto",
              }}
            >
              {sortedDisplayedProducts.map((product) => {
                const isSale = product.categoryId?.title === "Other";
                const discountedPrice = isSale
                  ? product.basePrice * 0.5
                  : product.basePrice;

                return (
                  <div
                    className="col-lg-3 col-md-6 col-sm-6 col-12"
                    key={product._id}
                  >
                    <div className="product-card">
                      <Link to={`/products/${product._id}`}>
                        <img src={product.imageUrl} alt={product.title} />
                      </Link>
                      <div className="product-infor">
                        <h2>
                          <Link to={`/products/${product._id}`}>
                            {product.title}
                          </Link>
                        </h2>
                        <div>
                          {isSale && (
                            <span
                              style={{ fontWeight: "700", color: "inherit" }}
                            >
                              {formatCurrency(discountedPrice)}đ
                            </span>
                          )}
                          <span
                            style={{
                              textDecoration: isSale ? "line-through" : "none",
                              color: isSale ? "gray" : "inherit",
                              marginLeft: isSale ? "8px" : "0",
                            }}
                          >
                            {formatCurrency(product.basePrice)}đ
                          </span>
                        </div>
                        <p>
                          {product.categoryId?.title || "Không có danh mục"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {filteredByColorAndPrice.length === 0 && (
            <div
              className="no-products-message"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                textAlign: "center",
                fontSize: "20px",
                color: "red",
              }}
            >
              <p
                style={{
                  fontSize: "20px",
                  color: "red",
                  fontWeight: "600",
                }}
              >
                <img
                  src={productContent}
                  alt="content"
                  style={{ display: "flex", marginBottom: "20px" }}
                />
                Không có sản phẩm nào
              </p>
            </div>
          )}
          {isCategoryPage ? (
            visibleProducts < filteredByColorAndPrice.length && (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  className="categoryList-button"
                  onClick={handleShowMore}
                >
                  Xem thêm
                </button>
              </div>
            )
          ) : (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                to={`/category/${category.slug}`}
                className="categoryList-button"
              >
                Xem thêm
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CategoryProductList.propTypes = {
  slug: PropTypes.string,
};

export default CategoryProductList;
