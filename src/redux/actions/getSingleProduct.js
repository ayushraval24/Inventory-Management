import * as types from "../types/product";
import { getApi } from "./apis";

export const fetchSingleProductRequest = () => ({
  type: types.FETCH_SINGLE_PRODUCT_REQUEST,
});

export const fetchSingleProductSuccess = (data) => ({
  type: types.FETCH_SINGLE_PRODUCT_SUCESS,
  data: data,
});

export const fetchSingleProductFailed = (err) => ({
  type: types.FETCH_SINGLE_PRODUCT_FAILED,
  err: err,
});

export const fetchSingleProduct = (id) => (dispatch, getState) => {
  dispatch(fetchSingleProductRequest());

  getApi(`/products/${id}`)
    .then((res) => {
      dispatch(fetchSingleProductSuccess(res));
    })
    .catch((err) => {
      dispatch(fetchSingleProductFailed(err));
    });
};
