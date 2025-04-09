import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";
import { createProduct, editProduct, removeProduct } from "./productAction";

//  API URL
const API_URL = "http://localhost:9999/api/products";

//  Fetch danh sách sản phẩm từ API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data || [];
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Không thể lấy danh sách sản phẩm"
      );
    }
  }
);

//  Tạo slice quản lý sản phẩm
const productSlice = createSlice({
  // name: "product",
  // initialState,
  name: "products",
  initialState: {
    products: [],
    searchTerm: "",
    loading: false,
    error: null,
  },

  reducers: {
    //  Cập nhật từ khóa tìm kiếm trong Redux
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

//  Export action để cập nhật từ khóa tìm kiếm
export const { setSearchTerm } = productSlice.actions;

// Selector lấy từ khóa tìm kiếm
export const selectSearchTerm = (state) => state.products?.searchTerm || "";

// Selector lấy danh sách sản phẩm
export const selectProducts = (state) => state.products?.products || [];
//  Tạo selector MEMOIZED theo danh mục
export const makeSelectProductsByCategory = () =>
  createSelector(
    [selectProducts, (_, category) => category],
    (products, category) =>
      products.filter((product) => product.categoryId?.title === category)
  );

//  Export reducer
export default productSlice.reducer;
