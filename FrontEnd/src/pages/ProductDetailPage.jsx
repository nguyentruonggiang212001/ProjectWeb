import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getByCategory, getById } from "../services/productServices";
import "../css/style.css";
import "../css/grid.css";
import zaloIcon from "../img/Icon_of_Zalo.svg.png";
import giftbox from "../img/giftbox.svg";
import saleOnline from "../img/sale-online.svg";
import tick from "../img/Flat_tick_icon.svg";
import ship from "../img/Ship.png";
import process from "../img/process.svg";
import moneyBag from "../img/money-bag.png";
import { useDispatch, useSelector } from "react-redux";
import { createCart, fetchCarts } from "./../features/products/cartAction";
import { fetchProducts } from "../features/products/productAction";
import { getVariantsByProductId } from "../services/variantService";
import { addCart } from "../services/cartServices";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho toast

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const carts = useSelector((state) => state.carts.carts || []);
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [variants, setVariants] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [enableSize, setEnableSize] = useState(false);
  const [enableColor, setEnableColor] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState([]);
  const categorySlug =
    data.categoryId?.slug ||
    data.categoryId?.title.replace(/\s+/g, "-").toLowerCase() ||
    "default-slug";

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCarts(user._id));
    }
  }, [user?._id, dispatch]);

  const addCartHandler = async () => {
    if (!selectedVariant) {
      toast.error("Sản phẩm không có sẵn trong kho!");
      return;
    }

    if (quantity < 1 || quantity > selectedVariant.stock) {
      toast.error(
        `Số lượng của loại sản phẩm này còn ${selectedVariant.stock} vui lòng chọn loại khác.`
      );
      return;
    }

    // Tạo đối tượng sản phẩm để thêm vào giỏ hàng
    const cartItem = {
      productId: id || selectedVariant.productId,
      variantId: selectedVariant._id,
      quantity: quantity,
      price: selectedVariant.price,
      stock: selectedVariant.stock,
      size: selectedSize,
      color: selectedColor,
    };

    // Nếu người dùng chưa đăng nhập
    if (!user?._id) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng tạm thời chưa
      const existingItemIndex = guestCart.findIndex(
        (item) => item.variantId === cartItem.variantId
      );

      if (existingItemIndex !== -1) {
        // Nếu đã có, cập nhật số lượng
        const newQuantity =
          guestCart[existingItemIndex].quantity + cartItem.quantity;
        if (newQuantity > selectedVariant.stock) {
          toast.error("Số lượng trong giỏ hàng không được vượt quá tồn kho!");
          return;
        }
        guestCart[existingItemIndex].quantity = newQuantity; // Cập nhật số lượng
      } else {
        // Nếu chưa có, thêm mới vào giỏ hàng tạm
        guestCart.push(cartItem);
      }

      // Lưu giỏ hàng tạm thời vào localStorage
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      window.dispatchEvent(new Event("storage"));
      toast.success("Sản phẩm đã được thêm vào giỏ hàng tạm thời!");
      return;
    }

    // Nếu người dùng đã đăng nhập, kiểm tra số lượng trong giỏ hàng
    const cartQuantity =
      carts.find((item) => item.variantId === selectedVariant?._id)?.quantity ||
      0;

    if (cartQuantity + quantity > selectedVariant.stock) {
      toast.error("Số lượng trong giỏ hàng không được vượt quá tồn kho!");
      return;
    }

    // Thêm thông tin người dùng vào cartItem
    cartItem.userId = user._id;

    // Kiểm tra dữ liệu hợp lệ
    if (!cartItem.userId || !cartItem.productId || !cartItem.variantId) {
      console.error("Dữ liệu không hợp lệ khi gửi API!", cartItem);
      toast.error("Lỗi: Dữ liệu không hợp lệ!");
      return;
    }

    try {
      // Gọi API thêm vào giỏ hàng
      const updatedCart = await addCart(cartItem);
      if (updatedCart) {
        // Cập nhật Redux store
        dispatch(createCart(updatedCart));
        dispatch(fetchCarts(user._id));
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          dispatch(fetchProducts(id));
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const productData = await getById(id);
        if (!productData || !productData._id) {
          console.error(" Lỗi: Không tìm thấy sản phẩm!");
          return;
        }
        setData(productData);

        // Lấy categoryId từ productData
        const categoryId =
          typeof productData.categoryId === "object"
            ? productData.categoryId._id
            : productData.categoryId;

        // Gọi API lấy sản phẩm cùng danh mục
        const suggested = await getByCategory(categoryId);

        // Lọc sản phẩm để loại bỏ chính sản phẩm hiện tại
        const filteredSuggested = suggested.filter((product) => {
          const productCategoryId =
            typeof product.categoryId === "object"
              ? product.categoryId._id
              : product.categoryId;

          return (
            String(productCategoryId) === String(categoryId) &&
            String(product._id) !== String(productData._id)
          );
        });

        // console.log(" Sản phẩm sau khi lọc:", filteredSuggested);
        setSuggestedProducts(filteredSuggested);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
      }
    })();
  }, [id]);

  //  Lấy thông tin sản phẩm
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const productData = await getById(id);
          if (!productData || !productData._id) {
            console.error("Lỗi: Không tìm thấy sản phẩm!");
            return;
          }
          setData(productData);

          // Lấy attributes từ variants
          if (productData.variants && productData.variants.length > 0) {
            const allAttributes = productData.variants.flatMap(
              (variant) => variant.attributes
            );
            setAttributes(allAttributes); // Lưu trữ tất cả attributes từ variants
          } else {
            setAttributes([]); // Nếu không có variants, đặt attributes là mảng rỗng
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
      })();
    }
  }, [id]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN").format(amount).replace(/\./g, ",");

  useEffect(() => {
    if (id) {
      setVariants([]);
      (async () => {
        try {
          const variantData = await getVariantsByProductId(id);
          const filteredVariants = variantData.filter(
            (variant) =>
              variant.productId !== null &&
              (variant.productId?._id === id || variant.productId === id)
          );
          setVariants(filteredVariants);

          // Kiểm tra sản phẩm có Size hoặc Color không
          const hasSize = filteredVariants.some((variant) =>
            variant.attributes.some((attr) => attr.attributeId.name === "Size")
          );
          const hasColor = filteredVariants.some((variant) =>
            variant.attributes.some((attr) => attr.attributeId.name === "Color")
          );

          setEnableSize(hasSize);
          setEnableColor(hasColor);

          // Nếu không có kích thước, tự động chọn màu sắc đầu tiên
          if (!hasSize && hasColor) {
            const firstColor = filteredVariants[0].attributes.find(
              (attr) => attr.attributeId.name === "Color"
            ).value;
            setSelectedColor(firstColor);
            updateVariant(firstColor, null); // Gọi hàm để cập nhật SKU
          }
        } catch (error) {
          console.error("Lỗi khi lấy variants:", error);
        }
      })();
    }
  }, [id]);

  useEffect(() => {
    const uniqueColors = [
      ...new Set(
        variants
          .map(
            (variant) =>
              variant.attributes.find(
                (attr) => attr.attributeId.name === "Color"
              )?.value
          )
          .filter(Boolean)
      ),
    ];
    setColors(uniqueColors);
    if (uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]); // Chọn Color đầu tiên nếu có
      updateVariant(selectedColor, uniqueColors[0]);
    }
  }, [variants]);

  useEffect(() => {
    const uniqueSizes = [
      ...new Set(
        variants
          .map(
            (variant) =>
              variant.attributes.find(
                (attr) => attr.attributeId.name === "Size"
              )?.value
          )
          .filter(Boolean)
      ),
    ];
    setSizes(uniqueSizes);
    if (uniqueSizes.length > 0) {
      setSelectedSize(uniqueSizes[0]); // Chọn Size đầu tiên
      updateVariant(selectedColor, uniqueSizes[0]); // Cập nhật SKU ngay
    }
  }, [variants]);

  useEffect(() => {
    if (selectedSize) {
      updateVariant(selectedColor, selectedSize);
    }
  }, [selectedColor, selectedSize]);

  const updateVariant = (color, size) => {
    if (!color) {
      setSelectedVariant(null);
      setSelectedSku("Không có SKU phù hợp");
      return;
    }

    const foundVariant = variants.find((variant) => {
      const hasColor = enableColor
        ? variant.attributes.some(
            (attr) => attr.attributeId.name === "Color" && attr.value === color
          )
        : true;

      // Nếu không có kích thước, chỉ cần kiểm tra màu sắc
      const hasSize = enableSize
        ? variant.attributes.some(
            (attr) => attr.attributeId.name === "Size" && attr.value === size
          )
        : true; // Nếu không có kích thước, trả về true

      return hasColor && hasSize;
    });

    if (foundVariant) {
      setSelectedSku(foundVariant.sku);
      setSelectedVariant(foundVariant);
    } else {
      setSelectedSku("Không có SKU phù hợp");
      setSelectedVariant(null);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    updateVariant(color, selectedSize); // Gọi hàm với màu sắc đã chọn
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    updateVariant(selectedColor, size); // Gọi hàm với kích thước đã chọn
  };

  return (
    <div>
      <div className="container">
        <section>
          <div className="header-contenxt">
            <div className="container">
              <ul>
                <li>
                  <a href="/">Trang chủ |</a>
                </li>
                <li>Sản phẩm của Tokyolife</li>
              </ul>
            </div>
          </div>
        </section>
        <div className="row">
          <div className="col-lg-6 col-sm-12 col-12">
            <img className="detail-img" src={data.imageUrl} alt={data.title} />
          </div>
          <div className="col-lg-6 col-sm-12 col-12">
            <div className="content-product">
              <p className="header">
                {data.categoryId === "Sale" ? "Giảm Giá " : "Bán Chạy"}
              </p>
              <h1>Sản Phẩm {data.title}</h1>
              <div className="quantity-text">
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgb(85, 85, 85)",
                    fontWeight: 400,
                  }}
                >
                  SKU: {selectedSku}
                </p>
              </div>

              <div>
                <span style={{ fontWeight: 600 }}>Danh Mục Sản Phẩm:</span>
                {data.categoryId ? data.categoryId.title : "Chưa có danh mục"}
              </div>
              <div className="description">
                <p>
                  <span style={{ fontWeight: 600 }}>Chi tiết sản phẩm:</span>
                  {data.description}
                </p>
              </div>
              <div className="content-price">
                <div className="price">
                  {selectedVariant ? (
                    // Nếu có biến thể, hiển thị giá của biến thể
                    data.categoryId?.title === "Sale" ? (
                      <>
                        <div style={{ display: "flex" }} className="price">
                          {formatCurrency(selectedVariant.price * 0.5)}đ
                        </div>
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "gray",
                          }}
                        >
                          {formatCurrency(selectedVariant.price)}đ
                        </span>
                      </>
                    ) : (
                      <div className="price">
                        {formatCurrency(selectedVariant.price)}đ
                      </div>
                    )
                  ) : // Nếu không có biến thể, hiển thị basePrice
                  data.categoryId?.title === "Sale" ? (
                    <>
                      <div style={{ display: "flex" }} className="price">
                        {formatCurrency(data.basePrice * 0.5)}đ
                      </div>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "gray",
                        }}
                      >
                        {formatCurrency(data.basePrice)}đ
                      </span>
                    </>
                  ) : (
                    <div className="price">
                      {formatCurrency(data.basePrice)}đ
                    </div>
                  )}
                </div>

                <div className="stock">
                  <span>Còn hàng</span>
                  <img src={tick} alt="tick" />
                </div>
              </div>
              <div className="promotion">
                <div className="line"></div>
                <div className="title">
                  <span>KHUYẾN MÃI</span>
                </div>
                <div className="sale">
                  <ul>
                    <li>
                      <img src={giftbox} alt="box" />
                      <p>
                        Mua áo chống nắng dáng dài chỉ từ
                        <strong style={{ marginLeft: "4px" }}>
                          325.000đ
                        </strong>{" "}
                        .<a href="#">Xem hướng dẫn.</a>
                      </p>
                    </li>
                    <li>
                      <img src={giftbox} alt="box" />
                      <p>
                        <strong>GIẢM 10% tối đa 100K</strong> cho đơn từ
                        333.000đ khi nhập <strong>LUCKY11</strong> tại bước
                        thanh toán.
                        <a href="#">Sao chép</a>
                      </p>
                    </li>
                    <li>
                      <img src={giftbox} alt="box" />
                      <p>
                        Nhập <strong>HPBD111</strong> giảm ngay
                        <strong style={{ marginLeft: "4px" }}>111K</strong> tại
                        bước thanh toán cho đơn từ 888.000đ.{" "}
                        <a href="#">Sao chép</a>
                      </p>
                    </li>
                    <li>
                      <img src={giftbox} alt="box" />
                      <p>
                        Săn sale <span>giày thể thao</span> chỉ từ
                        <strong style={{ marginLeft: "4px" }}>499.000đ.</strong>
                        <a href="#">Xem ngay</a>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="product-box">
                <div className="box">
                  <img src={saleOnline} alt="sale" />
                  <p>Giá độc quyền online</p>
                </div>
              </div>
              <div className="zalo">
                <img src={zaloIcon} alt="zalo" />
                <p>Chat ngay để nhận tư vấn sản phẩm</p>
                <i className="fa-solid fa-arrow-right-long"></i>
              </div>
              <div>
                {enableColor && colors.length > 0 && (
                  <div>
                    <strong>Chọn màu sắc:</strong>
                    {colors.map((color) => (
                      <button
                        key={color}
                        defaultValue={selectedColor}
                        onClick={() => handleColorChange(color)}
                        style={{
                          backgroundColor:
                            selectedColor === color ? "lightblue" : "white",
                          margin: "5px",
                          width: "60px",
                          borderRadius: "60px",
                          padding: "4px 0px",
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {enableSize && sizes.length > 0 && (
                  <div>
                    <strong>Chọn kích thước:</strong>
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(size)}
                        style={{
                          backgroundColor:
                            selectedSize === size ? "lightblue" : "white",
                          margin: "5px",
                          width:
                            data.categoryId?.title === "Kính Râm" ||
                            (data.categoryId?.title === "NHÀ CỬA VÀ ĐỜI SỐNG" &&
                              data.title !==
                                "Bộ bàn chải đánh răng kèm 5 đầu làm sạch sâu")
                              ? "112px"
                              : "60px",
                          borderRadius: "60px",
                          padding: "4px 0px",
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                {Array.isArray(attributes) && attributes.length > 0 ? (
                  attributes
                    .filter(
                      (attr) =>
                        attr.attributeId.name.toLowerCase() !== "size" &&
                        attr.attributeId.name.toLowerCase() !== "color"
                    )
                    .map((attr) => (
                      <div key={attr._id}>
                        <strong>{attr.attributeId.name}:</strong>
                        <span>{attr.value}</span>
                      </div>
                    ))
                ) : (
                  <p>Không có thuộc tính nào để hiển thị.</p>
                )}
              </div>

              <div className="stock">
                <div>
                  <p>
                    <span style={{ fontWeight: "600px" }}>Còn:</span>
                    {selectedVariant ? selectedVariant.stock : data.totalStock}
                    sản phẩm
                  </p>
                </div>
              </div>
              <div>
                <strong>Số lượng:</strong>
                <div className="quantity-control">
                  <button
                    className="left"
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    -
                  </button>

                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => {
                      let value =
                        parseInt(e.target.value.replace(/\D/g, ""), 10) || 1;

                      //  Kiểm tra nếu số lượng vượt quá tồn kho
                      if (value > selectedVariant?.stock) {
                        alert(
                          `Số lượng không được vượt quá tồn kho (${selectedVariant.stock})!`
                        );
                        value = selectedVariant.stock;
                      }

                      setQuantity(value);
                    }}
                    style={{
                      width: "20px",
                      textAlign: "center",
                      border: "none",
                      outline: "none",
                    }}
                  />

                  <button
                    className="right"
                    onClick={() =>
                      setQuantity((prev) =>
                        prev < selectedVariant?.stock ? prev + 1 : prev
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="buy">
                <button className="buy-cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>
                    <a
                      className="add-product"
                      href="#!"
                      onClick={addCartHandler}
                    >
                      Thêm giỏ hàng
                    </a>
                  </span>
                </button>
                <button className="buy-bag">
                  <i className="fa-solid fa-bag-shopping"></i>
                  <span>
                    <a href="/cart">Mua ngay</a>
                  </span>
                </button>
              </div>
              <div className="market-product">
                <button className="market">
                  <p>
                    <a href="/">Cửa hàng có sẵn sản phẩm</a>
                  </p>
                </button>
              </div>
              <div className="service">
                <div className="service-sub">
                  <img src={ship} alt="ship" />
                  <p>Miễn phí giao hàng xem tại giỏ hàng(*)</p>
                </div>
                <div className="service-sub">
                  <img src={process} alt="process" />
                  <p>1 đổi 1 trong vòng 7 ngày</p>
                </div>
                <div className="service-sub">
                  <img src={moneyBag} alt="money-bag" />
                  <p>Kiểm tra hàng trước khi thanh toán</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="suggested-products">
        <div className="container">
          <h2>Sản phẩm cùng danh mục:</h2>
          <div className="row">
            {suggestedProducts.length > 0 ? (
              suggestedProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="col-lg-3 col-sm-6 col-12">
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
                      <div>Giá: {formatCurrency(product.basePrice)}đ</div>
                      <p>{product.categoryId?.title || "Không xác định"}</p>
                      <button>
                        <Link to={`/products/${product._id}`}>Mua ngay</Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm cùng danh mục.</p>
            )}
          </div>
          {suggestedProducts.length > 4 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Link
                to={`/category/${categorySlug}`}
                className="categoryList-button"
              >
                Xem thêm
              </Link>
            </div>
          )}
        </div>
      </section>
      <ToastContainer style={{ marginTop: "20px" }} />
    </div>
  );
};

export default ProductDetailPage;
