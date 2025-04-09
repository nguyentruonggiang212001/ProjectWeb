// // import { createSlice } from "@reduxjs/toolkit";
// // import { createCart, editCarts, fetchCarts, removeCarts } from "./cartAction";

// // const initialState = {
// //   carts: [],
// //   loading: false,
// //   error: null,
// // };

// // const cartsSlice = createSlice({
// //   name: "carts",
// //   initialState,
// //   reducers: {
// //     resetCarts: (state) => {
// //       state.carts = [];
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchCarts.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(fetchCarts.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.carts = action.payload;
// //       })
// //       .addCase(fetchCarts.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.error.message;
// //       })
// //       .addCase(createCart.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(createCart.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.carts.push(action.payload);
// //       })
// //       .addCase(createCart.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.error.message;
// //       })
// //       .addCase(editCarts.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(editCarts.fulfilled, (state, action) => {
// //         state.loading = false;
// //         const index = state.carts.findIndex(
// //           (carts) => carts.id === action.payload.id
// //         );
// //         if (index !== -1) {
// //           state.carts[index] = action.payload;
// //         }
// //       })
// //       .addCase(editCarts.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.error.message;
// //       })
// //       .addCase(removeCarts.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(removeCarts.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.carts = state.carts.filter(
// //           (carts) => carts.id !== action.payload
// //         );
// //       })
// //       .addCase(removeCarts.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.error.message;
// //       });
// //   },
// // });

// // export const { resetCarts } = cartsSlice.actions;

// // const cartsReducer = cartsSlice.reducer;

// // export default cartsReducer;

import { createSlice } from "@reduxjs/toolkit";
import { fetchCarts, createCart, editCarts, removeCarts } from "./cartAction";

const initialState = {
  carts: [], //  Danh sách giỏ hàng
  loading: false, //  Trạng thái loading
  error: null, //  Lỗi nếu có
};

const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    resetCarts: (state) => {
      state.carts = []; // Xóa toàn bộ giỏ hàng
    },
  },
  extraReducers: (builder) => {
    builder
      //  Lấy giỏ hàng
      .addCase(fetchCarts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.loading = false;
        // console.log(" [Redux] Dữ liệu giỏ hàng từ API:", action.payload);
        state.carts = Array.isArray(action.payload) ? action.payload : [];
        // console.log("🛒 [Redux] Giỏ hàng sau khi lưu vào state:", state.carts);
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error(" [Redux] Lỗi khi lấy giỏ hàng:", action.error);
      })

      //  Thêm sản phẩm vào giỏ hàng
      .addCase(createCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.carts.push(action.payload);
        }
      })
      .addCase(createCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error(" [Redux] Lỗi khi thêm sản phẩm:", action.error);
      })

      //  Cập nhật số lượng sản phẩm trong giỏ hàng
      .addCase(editCarts.pending, (state) => {
        state.loading = true;
      })
      .addCase(editCarts.fulfilled, (state, action) => {
        state.loading = false;

        const cartIndex = state.carts.map((product) => {
          return action.payload.items.findIndex(
            (p) => p.productId === product.productId._id
          );
        });

        if (cartIndex !== -1) {
          state.carts[cartIndex] = { ...action.payload };
          state.carts = state.carts[cartIndex].items;
        } else {
          state.carts.push(action.payload);
        }
      })
      .addCase(editCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error(" [Redux] Lỗi khi cập nhật giỏ hàng:", action.error);
      })

      //  Xóa sản phẩm khỏi giỏ hàng
      .addCase(removeCarts.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCarts.fulfilled, (state, action) => {
        state.loading = false;

        const { productId, variantId, size, color } = action.payload;

        console.log(" Xóa sản phẩm:", action.payload);

        state.carts = state.carts.filter((cart) => {
          if (cart.productId._id !== productId._id) return true; // Giữ lại nếu khác productId

          // Nếu có variantId, chỉ xóa đúng biến thể
          if (variantId) {
            return cart.variantId !== variantId;
          }

          // Nếu không có variantId, kiểm tra size & color
          return !(cart.size === size && cart.color === color);
        });

        console.log(" [Redux] Giỏ hàng sau khi xóa:", state.carts);
      })
      .addCase(removeCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error(" [Redux] Lỗi khi xóa sản phẩm:", action.error);
      });
  },
});

export const { resetCarts } = cartsSlice.actions;
export default cartsSlice.reducer;
