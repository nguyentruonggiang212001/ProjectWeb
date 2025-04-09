import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { schemaProduct } from "../../schemas/productShema";
import { useEffect, useState } from "react";
import { getById } from "../../services/productServices";
import { useDispatch } from "react-redux";
import instance from "../../services";
import { fetchProducts } from "../../features/products/productAction";
import { getAllCategory } from "../../services/categoryServices";
import { getAllAttributes } from "./../../services/attributeService";

const { VITE_CLOUD_NAME, VITE_UPLOAD_PRESET } = import.meta.env;

const ProductForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaProduct),
  });

  const { id } = useParams();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [thumbnailOption, setThumbnailOption] = useState("keep");
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategory] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [formattedBasePrice, setFormattedBasePrice] = useState("");
  const [formattedVariantPrice, setFormattedVariantPrice] = useState("");

  console.log("Danh sách biến thể:", variants);

  //  Thêm state để kiểm soát Size & Color
  const [enableSize, setEnableSize] = useState(false);
  const [enableColor, setEnableColor] = useState(false);

  // Lấy danh mục sản phẩm
  useEffect(() => {
    (async () => {
      const { data } = await getAllCategory();
      setCategory(data);
    })();
  }, []);

  // Lấy danh sách attributes (Size, Color)
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllAttributes();
        console.log(data);
        setAttributes(data);
      } catch (error) {
        console.error("Failed to fetch attributes:", error);
      }
    })();
  }, []);

  // Định dạng tiền VNĐ
  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0, // Không hiển thị số lẻ
    })
      .format(value)
      .replace(/\./g, ","); // Thay dấu "." thành ","
  };

  // Xử lý nhập giá tiền
  const handlePriceChange = (event) => {
    let rawValue = event.target.value.replace(/\D/g, ""); // Chỉ giữ lại số

    if (rawValue) {
      rawValue = parseInt(rawValue, 10);
      setFormattedBasePrice(formatCurrency(rawValue)); // Hiển thị có dấu `,`
      setValue("basePrice", rawValue, { shouldValidate: true }); // Lưu giá trị số vào react-hook-form
    } else {
      setFormattedBasePrice("");
      setValue("basePrice", "", { shouldValidate: true });
    }
  };

  //  Xử lý nhập giá tiền cho variant
  const handleVariantPriceChange = (event) => {
    let rawValue = event.target.value.replace(/\D/g, ""); // Chỉ giữ lại số
    if (rawValue) {
      rawValue = parseInt(rawValue, 10);
      setFormattedVariantPrice(formatCurrency(rawValue)); // Hiển thị có dấu `,`
      setValue("variantPrice", rawValue, { shouldValidate: true }); // Cập nhật giá trị số vào react-hook-form
    } else {
      setFormattedVariantPrice("");
      setValue("variantPrice", "", { shouldValidate: true });
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
      dispatch(fetchProducts());
    } else {
      setIsAdmin(false);
      return;
    }

    if (id) {
      (async () => {
        try {
          const data = await getById(id);
          // console.log(" Sản phẩm lấy từ backend:", data); //  Log để kiểm tra

          //  Đảm bảo variants có `_id`
          if (data.variants) {
            data.variants = data.variants.map((variant) => ({
              ...variant,
              _id: variant._id || undefined, // Nếu `_id` tồn tại thì giữ lại
            }));
          }

          reset(data); //  Điền dữ liệu vào form
          setVariants(data.variants || []);
          setThumbnailUrl(data.thumbnail);
          setFormattedBasePrice(formatCurrency(data.basePrice));
        } catch (error) {
          console.error(" Lỗi khi lấy sản phẩm:", error);
        }
      })();
    }
  }, [id, dispatch]);

  if (!isAdmin) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "205px",
          color: "red",
          fontSize: "20px",
        }}
      >
        Bạn không có quyền truy cập trang này!
      </h2>
    );
  }

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", VITE_UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${VITE_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  };

  const generateSKU = (size, color) => {
    const sizePart = enableSize && size ? size.slice(0, 2).toUpperCase() : "XX";
    const colorPart =
      enableColor && color ? color.slice(0, 2).toUpperCase() : "XX";
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `TS-${sizePart}-${colorPart}-${randomPart}`;
  };

  //  Hàm xử lý submit form

  const handleAddVariant = () => {
    const variantSize = getValues("variantSize");
    const variantColor = getValues("variantColor");
    const variantPrice = getValues("variantPrice");
    const variantStock = getValues("variantStock");

    if (!variantPrice || !variantStock) {
      alert("Vui lòng nhập giá và số lượng tồn kho!");
      return;
    }

    // Lấy ID của Size và Color từ danh sách attributes
    const sizeAttr = attributes.find((attr) => attr.name === "Size");
    const colorAttr = attributes.find((attr) => attr.name === "Color");

    // **Lấy tất cả thuộc tính khác (VD: Chất Liệu, Kiểu Dáng)**
    const otherAttributes = attributes
      .filter((attr) => attr.name !== "Size" && attr.name !== "Color")
      .map((attr) => {
        const value = getValues(`variant-${attr.name}`);
        const allValues = getValues();
        return value ? { attributeId: attr._id, value } : null;
      })
      .filter(Boolean); // Xóa `null` nếu không có giá trị

    // Tạo object variant với tất cả thuộc tính
    const newVariant = {
      attributes: [
        ...(enableSize && variantSize
          ? [{ attributeId: sizeAttr?._id, value: variantSize }]
          : []),
        ...(enableColor && variantColor
          ? [{ attributeId: colorAttr?._id, value: variantColor }]
          : []),
        ...otherAttributes, // Thêm thuộc tính khác
      ],
      price: Number(variantPrice),
      stock: Number(variantStock),
      sku: generateSKU(variantSize, variantColor), // Tạo SKU hợp lệ
    };

    console.log("Biến thể mới:", newVariant);

    setVariants((prev) => [...prev, newVariant]);

    // Reset input sau khi thêm
    setFormattedVariantPrice("");
    setValue("variantPrice", "");
    setValue("variantStock", "");
  };

  const onSubmit = async (product) => {
    try {
      console.log("Dữ liệu trước khi gửi lên backend:", product);

      let updatedProduct = {
        ...product,
        basePrice: getValues("basePrice"),
        variants: variants.length > 0 ? variants : product.variants, //  Giữ nguyên variants nếu không thay đổi
      };

      //  Xử lý ảnh Thumbnail (tránh gửi undefined)
      switch (thumbnailOption) {
        case "upload":
          if (product.thumbnail && product.thumbnail[0]) {
            const thumbnailUrl = await uploadImage(product.thumbnail[0]);
            updatedProduct.imageUrl = thumbnailUrl;
          }
          break;
        case "link":
          if (product.thumbnail) {
            updatedProduct.imageUrl = product.thumbnail;
          }
          break;
        default:
          updatedProduct.imageUrl =
            product.thumbnail || updatedProduct.imageUrl;
      }

      if (!updatedProduct.imageUrl) {
        delete updatedProduct.imageUrl; //  Xóa nếu không có giá trị hợp lệ
      }

      //  Kiểm tra xem variant có `_id` hay không trước khi gửi
      if (updatedProduct.variants) {
        updatedProduct.variants = updatedProduct.variants.map((variant) => {
          if (variant._id) {
            return variant; //  Giữ nguyên nếu đã có _id
          } else {
            console.warn(" Variant mới không có _id:", variant);
            return { ...variant, _id: undefined }; //  Đảm bảo không gửi _id trống
          }
        });
      }

      // console.log(" Dữ liệu gửi lên backend:", updatedProduct); //  Kiểm tra lần cuối

      let response;

      if (id) {
        response = await instance.put(`/products/${id}`, updatedProduct);
        dispatch({
          type: "UPDATE_PRODUCT",
          payload: { id, product: response.data },
        });
      } else {
        response = await instance.post("/products", updatedProduct);
        dispatch({ type: "ADD_PRODUCT", payload: response.data });
      }

      nav("/");
    } catch (error) {
      console.error(" Lỗi khi gửi sản phẩm:", error);
    }
  };

  return (
    <div className="container" style={{ width: "92vh" }}>
      <div className="col-12">
        <div
          className="form-user"
          style={{
            marginTop: "50px",
            marginBottom: "50px",
            position: "relative",
            top: "0",
            left: "0",
            transform: "translate(0%,0%)",
          }}
        >
          <h1
            className="header-update"
            style={{
              fontSize: "25px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {id ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
          </h1>

          <form className="product-form" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="title">Tên sản phẩm</label>
            <input
              type="text"
              id="title"
              placeholder="Nhập tên sản phẩm"
              {...register("title", { required: true })}
            />
            {errors.title && (
              <p style={{ color: "red" }}>{errors.title?.message}</p>
            )}

            {/* Nhập giá sản phẩm */}
            <label htmlFor="basePrice">Giá sản phẩm</label>
            <input
              type="text"
              id="basePrice"
              placeholder="Nhập giá tiền"
              value={formattedBasePrice}
              onChange={handlePriceChange}
            />
            <input
              type="hidden"
              {...register("basePrice", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors.basePrice && (
              <p style={{ color: "red" }}>{errors.basePrice?.message}</p>
            )}

            {/* Nhập mô tả sản phẩm */}
            <label htmlFor="description">Mô tả sản phẩm</label>
            <textarea
              id="description"
              placeholder="Nhập mô tả sản phẩm"
              {...register("description", { required: true })}
              rows="4"
            ></textarea>

            {/* Nhập số lượng tồn kho */}
            <label htmlFor="totalStock">Số lượng tồn kho</label>
            <input
              type="number"
              id="totalStock"
              placeholder="Nhập số lượng"
              {...register("totalStock", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors.totalStock && (
              <p style={{ color: "red" }}>{errors.totalStock?.message}</p>
            )}

            {/* Chọn danh mục sản phẩm */}
            <label htmlFor="categoryId">Danh mục sản phẩm</label>
            <select
              id="categoryId"
              {...register("categoryId", { required: true })}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p style={{ color: "red" }}>{errors.categoryId?.message}</p>
            )}

            {/* Lựa chọn ảnh Thumbnail */}
            <label htmlFor="thumbnailOption">Chọn ảnh Thumbnail</label>
            <select
              id="thumbnailOption"
              value={thumbnailOption}
              onChange={(e) => setThumbnailOption(e.target.value)}
            >
              <option value="keep">Giữ ảnh hiện tại</option>
              <option value="link">Thêm ảnh từ đường link</option>
              <option value="upload">Tải ảnh lên</option>
            </select>

            {/* Nếu chọn thêm ảnh từ link */}
            {thumbnailOption === "link" && (
              <input
                type="text"
                id="thumbnail"
                placeholder="Nhập link ảnh"
                {...register("thumbnail")}
              />
            )}

            {/* Nếu chọn tải ảnh lên */}
            {thumbnailOption === "upload" && (
              <input
                type="file"
                id="thumbnail"
                {...register("thumbnail", { required: true })}
              />
            )}

            {/* Hiển thị ảnh thumbnail nếu có */}
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt="Ảnh sản phẩm"
                style={{ width: "100%", height: "auto", marginTop: "10px" }}
              />
            )}

            {/*  Chọn có Size hoặc Color hay không */}
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={enableSize}
                  onChange={(e) => setEnableSize(e.target.checked)}
                />
                Sản phẩm có Size
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={enableColor}
                  onChange={(e) => setEnableColor(e.target.checked)}
                />
                Sản phẩm có Color
              </label>
            </div>

            {/* Thêm biến thể sản phẩm */}
            <div
              className="variant-section"
              style={{
                marginTop: "20px",
                padding: "10px",
                border: "1px solid #ccc",
              }}
            >
              <h3>Thêm Variant</h3>

              {enableSize && (
                <div>
                  <label htmlFor="variantSize">Size</label>
                  <select {...register("variantSize")}>
                    <option value="">Chọn Size</option>
                    {attributes
                      .find((attr) => attr.name.toLowerCase() === "size")
                      ?.values.map((size) => {
                        return (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        );
                      })}
                  </select>
                </div>
              )}

              {enableColor && (
                <div>
                  <label htmlFor="variantColor">Color</label>
                  <select {...register("variantColor")}>
                    <option value="">Chọn Color</option>
                    {attributes
                      .find((attr) => attr.name.toLowerCase() === "color")
                      ?.values.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {attributes
                .filter(
                  (attr) =>
                    attr.name.toLowerCase() !== "size" &&
                    attr.name.toLowerCase() !== "color"
                )
                .map((attr) => (
                  <div key={attr._id}>
                    <label htmlFor={`variant-${attr.name}`}>{attr.name}</label>
                    <select {...register(`variant-${attr.name}`)}>
                      <option value="">Chọn {attr.name}</option>
                      {attr.values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

              {/* Nhập giá tiền cho variant */}
              <div>
                <label htmlFor="variantPrice">Giá Variant</label>
                <input
                  type="text"
                  placeholder="Nhập giá"
                  value={formattedVariantPrice}
                  onChange={handleVariantPriceChange}
                />
                <input
                  type="hidden"
                  {...register("variantPrice", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>

              {/* Nhập số lượng tồn kho cho variant */}
              <div>
                <label htmlFor="variantStock">Tồn kho</label>
                <input
                  type="number"
                  placeholder="Số lượng tồn kho"
                  {...register("variantStock", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>

              <button
                type="button"
                style={{
                  border: "none",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#00800091",
                }}
                onClick={handleAddVariant}
              >
                Thêm Variant
              </button>
            </div>

            <div className="variant-list" style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "5px" }}>Danh sách Variant</h4>
              {variants.length === 0 ? (
                <p style={{ marginBottom: "5px" }}>Chưa có variant nào</p>
              ) : (
                <ul>
                  {variants.map((variant, index) => {
                    const size =
                      variant.attributes.find(
                        (attr) =>
                          attr.attributeId ===
                          attributes.find((attr) => attr.name === "Size")?._id
                      )?.value || "Không có";

                    const color =
                      variant.attributes.find(
                        (attr) =>
                          attr.attributeId ===
                          attributes.find((attr) => attr.name === "Color")?._id
                      )?.value || "Không có";

                    return (
                      <li key={index}>
                        {enableSize && `Size: ${size} - `}
                        {enableColor && `Color: ${color} - `}
                        Giá: {variant.price.toLocaleString("vi-VN")} VND -
                        Stock: {variant.stock} - SKU: {variant.sku}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div
              className="button-group"
              style={{ textAlign: "left", marginTop: "20px" }}
            >
              <button
                style={{ backgroundColor: "green", marginRight: "5px" }}
                className="btn btn-primary"
                type="submit"
              >
                {id ? "Cập nhật" : "Thêm sản phẩm"}
              </button>
              <button
                type="reset"
                className="btn btn-secondary"
                style={{ backgroundColor: "gray" }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
