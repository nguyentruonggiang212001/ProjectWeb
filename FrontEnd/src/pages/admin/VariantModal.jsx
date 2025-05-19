import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  createVariant,
  updateVariant,
  deleteVariant,
} from "../../services/variantService";
import { getAllAttributes } from "../../services/attributeService";

const ITEMS_PER_PAGE = 5;

const EditVariantModal = ({
  product = { title: "", variants: [] },
  onClose,
}) => {
  const [variants, setVariants] = useState(product.variants || []);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [attributesList, setAttributesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(variants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVariants = variants.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const generateSKU = (variant) => {
    const sizePart = variant.size
      ? variant.size.slice(0, 2).toUpperCase()
      : "XX";
    const colorPart = variant.color
      ? variant.color.slice(0, 2).toUpperCase()
      : "XX";
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `TS-${sizePart}-${colorPart}-${randomPart}`;
  };

  // const handleVariantChange = (index, field, value) => {
  //   setVariants((prevVariants) => {
  //     const updatedVariants = [...prevVariants];
  //     updatedVariants[index] = {
  //       ...updatedVariants[index],
  //       [field]: value,
  //       sku: updatedVariants[index].sku || generateSKU(updatedVariants[index]), // Giữ nguyên SKU nếu đã có
  //     };

  //     // Cập nhật giá trị cho các thuộc tính khác
  //     const attrIndex = updatedVariants[index].attributes.findIndex(
  //       (attr) => attr.attributeId.name === field
  //     );
  //     if (attrIndex !== -1) {
  //       // Sao chép đối tượng attribute trước khi thay đổi
  //       const updatedAttributes = [...updatedVariants[index].attributes];
  //       updatedAttributes[attrIndex] = {
  //         ...updatedAttributes[attrIndex],
  //         value: value,
  //       };
  //       updatedVariants[index].attributes = updatedAttributes; // Cập nhật lại attributes
  //     }

  //     return updatedVariants;
  //   });
  // };

  // const handleAddVariant = () => {
  //   setVariants([...variants, { price: 0, color: "", size: "", stock: 0 }]);
  // };

  // const handleVariantChange = (index, field, value) => {
  //   setVariants((prevVariants) => {
  //     const updatedVariants = [...prevVariants];
  //     updatedVariants[index] = {
  //       ...updatedVariants[index],
  //       [field]: value,
  //       sku: updatedVariants[index].sku || generateSKU(updatedVariants[index]), // Giữ nguyên SKU nếu đã có
  //     };

  //     // Cập nhật giá trị cho các thuộc tính khác
  //     const attrIndex = updatedVariants[index].attributes.findIndex(
  //       (attr) => attr.attributeId._id === field // Sử dụng _id để tìm thuộc tính
  //     );
  //     if (attrIndex !== -1) {
  //       // Sao chép đối tượng attribute trước khi thay đổi
  //       const updatedAttributes = [...updatedVariants[index].attributes];
  //       updatedAttributes[attrIndex] = {
  //         ...updatedAttributes[attrIndex],
  //         value: value,
  //       };
  //       updatedVariants[index].attributes = updatedAttributes; // Cập nhật lại attributes
  //     }

  //     return updatedVariants;
  //   });
  // };
  // const handleAddVariant = () => {
  //   const newVariant = {
  //     price: 0,
  //     color: "",
  //     size: "",
  //     stock: 0,
  //     attributes: attributesList
  //       .filter((attr) => attr.name !== "Size" && attr.name !== "Color")
  //       .map((attr) => ({
  //         attributeId: { _id: attr._id },
  //         value: "", // Giá trị mặc định là trống
  //       })),
  //   };
  //   setVariants([...variants, newVariant]);
  // };

  const handleVariantChange = (index, field, value) => {
    setVariants((prevVariants) => {
      const updatedVariants = [...prevVariants];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
        sku: updatedVariants[index].sku || generateSKU(updatedVariants[index]), // Giữ nguyên SKU nếu đã có
      };

      // Cập nhật giá trị cho các thuộc tính khác
      const attrIndex = updatedVariants[index].attributes.findIndex(
        (attr) => attr.attributeId._id === field // Sử dụng _id để tìm thuộc tính
      );
      if (attrIndex !== -1) {
        // Sao chép đối tượng attribute trước khi thay đổi
        const updatedAttributes = [...updatedVariants[index].attributes];
        updatedAttributes[attrIndex] = {
          ...updatedAttributes[attrIndex],
          value: value,
        };
        updatedVariants[index].attributes = updatedAttributes; // Cập nhật lại attributes
      }

      return updatedVariants;
    });
  };

  const handleAddVariant = () => {
    const newVariant = {
      price: 0,
      color: "",
      size: "",
      stock: 0,
      attributes: attributesList
        .filter((attr) => attr.name !== "Size" && attr.name !== "Color")
        .map((attr) => ({
          attributeId: { _id: attr._id },
          value: "", // Giá trị mặc định là trống
        })),
    };
    setVariants([...variants, newVariant]);
  };

  const handleDeleteVariant = async (index) => {
    try {
      if (window.confirm("Bạn có chắc muốn xóa biến thể này?")) {
        const updatedVariants = [...variants];
        const deletedVariant = updatedVariants.splice(index, 1)[0];

        if (deletedVariant._id) {
          await deleteVariant(deletedVariant._id);
        }

        setVariants(updatedVariants);
        alert("Xóa biến thể thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa biến thể:", error);
      alert("Xóa thất bại!");
    }
  };

  // const handleSave = async () => {
  //   try {
  //     if (!product._id) {
  //       alert("Sản phẩm chưa được tạo, không thể lưu biến thể!");
  //       return;
  //     }

  //     const sizeAttribute = attributesList.find((attr) => attr.name === "Size");
  //     const colorAttribute = attributesList.find(
  //       (attr) => attr.name === "Color"
  //     );

  //     if (!sizeAttribute || !colorAttribute) {
  //       alert("Không tìm thấy thuộc tính Size hoặc Color!");
  //       return;
  //     }

  //     for (let variant of variants) {
  //       //  Định dạng lại dữ liệu variant
  //       const formattedVariant = {
  //         productId: { _id: product._id }, //  Đảm bảo productId là object
  //         attributes: [
  //           { attributeId: { _id: colorAttribute._id }, value: variant.color }, //  attributeId là object
  //           { attributeId: { _id: sizeAttribute._id }, value: variant.size },
  //         ],
  //         stock: variant.stock,
  //         price: variant.price,
  //         sku: variant.sku || generateSKU(variant),
  //       };

  //       //  In ra log kiểm tra trước khi gửi
  //       console.log(
  //         variant._id ? "Cập nhật biến thể:" : "Tạo biến thể mới:",
  //         formattedVariant
  //       );
  //       console.log("Variant Attributes:", variant.attributes);

  //       if (variant._id) {
  //         await updateVariant(variant._id, formattedVariant);
  //       } else {
  //         await createVariant(formattedVariant);
  //       }
  //     }

  //     alert("Lưu biến thể thành công!");
  //     onClose();
  //   } catch (error) {
  //     console.error("Lỗi khi lưu biến thể:", error);
  //     alert("Có lỗi xảy ra!");
  //   }
  // };

  // useEffect(() => {
  //   const fetchAttributes = async () => {
  //     try {
  //       const attributes = await getAllAttributes();
  //       console.log(" Danh sách thuộc tính:", attributes);
  //       setAttributesList(attributes);

  //       const colorsData = attributes.find((attr) => attr.name === "Color");
  //       const sizesData = attributes.find((attr) => attr.name === "Size");

  //       let newColors = colorsData ? colorsData.values : [];
  //       let newSizes = sizesData ? sizesData.values : [];

  //       // Kiểm tra xem có màu/kích thước nào trong variants nhưng chưa có trong danh sách không
  //       const variantColors = product.variants.map((v) => v.color);
  //       const variantSizes = product.variants.map((v) => v.size);

  //       newColors = [...new Set([...newColors, ...variantColors])];
  //       newSizes = [...new Set([...newSizes, ...variantSizes])];

  //       setColors(newColors);
  //       setSizes(newSizes);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy thuộc tính:", error);
  //     }
  //   };

  //   fetchAttributes();
  // }, [product]);

  const handleSave = async () => {
    try {
      if (!product._id) {
        alert("Sản phẩm chưa được tạo, không thể lưu biến thể!");
        return;
      }

      const sizeAttribute = attributesList.find((attr) => attr.name === "Size");
      const colorAttribute = attributesList.find(
        (attr) => attr.name === "Color"
      );

      if (!sizeAttribute || !colorAttribute) {
        alert("Không tìm thấy thuộc tính Size hoặc Color!");
        return;
      }

      for (let variant of variants) {
        const formattedVariant = {
          productId: { _id: product._id },
          attributes: [
            {
              attributeId: { _id: colorAttribute._id },
              value: variant.color || "",
            },
            {
              attributeId: { _id: sizeAttribute._id },
              value: variant.size || "",
            },
          ],
          stock: variant.stock,
          price: variant.price,
          sku: variant.sku || generateSKU(variant),
        };

        // Lấy các thuộc tính khác
        const otherAttributes = attributesList.filter(
          (attr) => attr.name !== "Color" && attr.name !== "Size"
        );

        for (let attr of otherAttributes) {
          const attrValue =
            variant.attributes.find((a) => a.attributeId._id === attr._id)
              ?.value || ""; // Nếu không có giá trị, để trống
          formattedVariant.attributes.push({
            attributeId: { _id: attr._id },
            value: attrValue,
          });
        }

        // Kiểm tra xem tất cả các thuộc tính đều có giá trị không
        const hasEmptyValue = formattedVariant.attributes.some(
          (attr) => !attr.value
        );
        if (hasEmptyValue) {
          alert("Vui lòng chọn giá trị cho tất cả các thuộc tính.");
          return;
        }

        // Ghi log dữ liệu gửi đi
        console.log("Dữ liệu gửi đi:", formattedVariant);

        if (variant._id) {
          await updateVariant(variant._id, formattedVariant);
        } else {
          await createVariant(formattedVariant);
        }
      }

      alert("Lưu biến thể thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi lưu biến thể:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const attributes = await getAllAttributes();
        console.log("Danh sách thuộc tính:", attributes);
        setAttributesList(attributes);

        // Lấy danh sách màu sắc và kích thước
        const colorsData = attributes.find((attr) => attr.name === "Color");
        const sizesData = attributes.find((attr) => attr.name === "Size");

        let newColors = colorsData ? colorsData.values : [];
        let newSizes = sizesData ? sizesData.values : [];

        // Kiểm tra xem có màu/kích thước nào trong variants nhưng chưa có trong danh sách không
        const variantColors = product.variants.map((v) => v.color);
        const variantSizes = product.variants.map((v) => v.size);

        newColors = [...new Set([...newColors, ...variantColors])];
        newSizes = [...new Set([...newSizes, ...variantSizes])];

        setColors(newColors);
        setSizes(newSizes);

        // Lấy các thuộc tính khác (như Vải, Cacbon)
        const otherAttributes = attributes.filter(
          (attr) => attr.name !== "Color" && attr.name !== "Size"
        );
        console.log("Các thuộc tính khác:", otherAttributes);
      } catch (error) {
        console.error("Lỗi khi lấy thuộc tính:", error);
      }
    };

    fetchAttributes();
  }, [product]);

  useEffect(() => {
    if (product.variants?.length > 0) {
      const formattedVariants = product.variants.map((variant) => {
        const sizeAttr = variant.attributes.find(
          (attr) => attr.attributeId.name === "Size"
        );
        const colorAttr = variant.attributes.find(
          (attr) => attr.attributeId.name === "Color"
        );

        return {
          ...variant,
          size: sizeAttr ? sizeAttr.value : "",
          color: colorAttr ? colorAttr.value : "",
        };
      });

      console.log("Biến thể sau khi format:", formattedVariants);
      setVariants(formattedVariants); // Cập nhật state
    }
  }, [product]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "900px",
          maxWidth: "90%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "15px",
            marginBottom: "10px",
            fontWeight: "bold",
          }}
        >
          {product?.title || "Sản phẩm chưa có tên"}
        </h3>

        {variants.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Giá</th>
                <th>Màu</th>
                <th>Kích Thước</th>
                {attributesList
                  .filter(
                    (attr) => attr.name !== "Size" && attr.name !== "Color"
                  )
                  .map((attr) => (
                    <th key={attr._id}>{attr.name}</th>
                  ))}
                <th>Stock</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVariants.map((variant, index) => {
                const realIndex = startIndex + index;
                return (
                  <tr key={realIndex}>
                    <td>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleVariantChange(
                            realIndex,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        style={{
                          width: "80px",
                          padding: "5px",
                          fontSize: "14px",
                        }}
                      />
                    </td>

                    <td>
                      <select
                        value={variant.color || ""}
                        onChange={(e) =>
                          handleVariantChange(
                            realIndex,
                            "color",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Chọn màu</option>
                        {colors.map((color, idx) => (
                          <option key={idx} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <select
                        value={variant.size || ""}
                        onChange={(e) =>
                          handleVariantChange(realIndex, "size", e.target.value)
                        }
                      >
                        <option value="">Chọn size</option>
                        {sizes.map((size, idx) => (
                          <option key={idx} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Các thuộc tính mới */}

                    {attributesList
                      .filter(
                        (attr) => attr.name !== "Size" && attr.name !== "Color"
                      )
                      .map((attr) => {
                        const attrValue =
                          variant.attributes?.find(
                            (a) => a.attributeId._id === attr._id
                          )?.value || "";

                        return (
                          <td key={attr._id}>
                            <select
                              value={attrValue}
                              onChange={(e) =>
                                handleVariantChange(
                                  realIndex,
                                  attr._id, // Sử dụng _id để cập nhật đúng thuộc tính
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100px",
                                padding: "5px",
                                fontSize: "14px",
                              }}
                            >
                              <option value="">{attr.name}</option>
                              {attr.values?.map((value, idx) => (
                                <option key={idx} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })}

                    <td>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          handleVariantChange(
                            realIndex,
                            "stock",
                            Number(e.target.value)
                          )
                        }
                        style={{
                          width: "50px",
                          padding: "5px",
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteVariant(realIndex)}
                        style={{
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor: "#ff0000b3",
                          borderRadius: "5px",
                          padding: "5px 10px",
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Không có biến thể nào.</p>
        )}

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "5px 10px",
                backgroundColor: "gray",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Trước
            </button>
            <span style={{ margin: "10px 15px" }}>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              style={{
                padding: "5px 10px",
                backgroundColor: "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Sau
            </button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "15px",
          }}
        >
          <button
            onClick={handleAddVariant}
            style={{
              background: "green",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Thêm Biến Thể
          </button>
          <button
            onClick={handleSave}
            style={{
              background: "blue",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Lưu Biến Thể
          </button>
          <button
            onClick={onClose}
            style={{
              background: "red",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

EditVariantModal.propTypes = {
  product: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditVariantModal;
