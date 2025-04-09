export const ADD_PRODUCT = "ADD_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const REMOVE_PRODUCT = "REMOVE_PRODUCT";

export const addProduct = (product) => ({
  type: ADD_PRODUCT,
  payload: product,
});

export const setProduct = (products) => ({
  type: SET_PRODUCTS,
  payload: products,
});

export const updateProduct = (product) => ({
  type: UPDATE_PRODUCT,
  payload: product,
});

export const removeProduct = (product) => ({
  type: REMOVE_PRODUCT,
  payload: product,
});
