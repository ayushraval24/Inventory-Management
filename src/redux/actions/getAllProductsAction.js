import * as types from "../types/product";
import { getApi } from "./apis";

export const fetchAllProductsRequest = () => ({
  type: types.FETCH_ALL_PRODUCTS_REQUEST,
});

export const fetchAllProductsSuccess = (data) => ({
  type: types.FETCH_ALL_PRODUCTS_SUCESS,
  data: data,
});

export const fetchAllProductsFailed = (err) => ({
  type: types.FETCH_SINGLE_PRODUCT_FAILED,
  err: err,
});

export const fetchAllProducts =
  (perPage, page, search) => (dispatch, getState) => {
    if (search) {
      dispatch(fetchAllProductsRequest());
      getApi(`/products/search`, {
        page: page,
        per_page: perPage,
        search: search,
      })
        .then((res) => {
          dispatch(fetchAllProductsSuccess(res));
        })
        .catch((err) => {
          dispatch(fetchAllProductsFailed(err));
        });
    } else {
      dispatch(fetchAllProductsRequest());

      getApi(`/products`, { page: page, per_page: perPage })
        .then((res) => {
          dispatch(fetchAllProductsSuccess(res));
        })
        .catch((err) => {
          dispatch(fetchAllProductsFailed(err));
        });
    }
  };
