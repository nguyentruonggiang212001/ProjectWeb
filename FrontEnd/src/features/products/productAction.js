import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../services/productServices";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    return await getAllProducts();
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product) => {
    return await addProduct(product);
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, product }) => {
    return await updateProduct(id, product);
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id, { rejectWithValue }) => {
    try {
      const result = await deleteProduct(id);
      if (result) {
        return id; // Trả về `id` nếu xóa thành công
      } else {
        return rejectWithValue("Xóa sản phẩm thất bại");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Lỗi không xác định");
    }
  }
);
