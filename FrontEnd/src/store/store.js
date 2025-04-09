import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import cartsReducer from "../features/products/cartSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    carts: cartsReducer,
  },
});

export default store;
