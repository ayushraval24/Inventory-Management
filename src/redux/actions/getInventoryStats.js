import * as types from "../types/product";
import { getApi } from "./apis";

export const fetchInventoryRequest = () => ({
  type: types.FETCH_INVENTORY_REQUEST,
});

export const fetchInventorySuccess = (data) => ({
  type: types.FETCH_INVENTORY_SUCESS,
  data: data,
});

export const fetchInventoryFailed = (err) => ({
  type: types.FETCH_ALL_PRODUCTS_FAILED,
  err: err,
});

export const fetchInventoryStats = (id) => (dispatch, getState) => {
  dispatch(fetchInventoryRequest());

  getApi(`/products/inventory`)
    .then((res) => {
      dispatch(fetchInventorySuccess(res));
    })
    .catch((err) => {
      dispatch(fetchInventoryFailed(err));
    });
};
