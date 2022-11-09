import { putApi } from "../actions/apis";
import * as types from "../types/product";
import { toast } from "react-toastify";

export const editProductRequest = () => ({
  type: types.EDIT_PRODUCT_REQUEST,
});

export const editProductSuccess = (data) => ({
  type: types.EDIT_PRODUCT_SUCESS,
  data: data,
});

export const editProductFailed = (err) => ({
  type: types.EDIT_PRODUCT_SUCESS,
  err: err,
});

export const fetchEditProduct = (data, id) => (dispatch, getState) => {
  dispatch(editProductRequest());

  putApi(`/products/${id}`, data, true)
    .then((res) => {
      dispatch(editProductSuccess(res));
      toast.success(res?.data?.message);
    })
    .catch((err) => {
      dispatch(editProductFailed(err));
      toast.error(err?.data?.message);
    });
};
