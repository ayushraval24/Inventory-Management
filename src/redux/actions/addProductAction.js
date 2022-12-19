import { postApi } from "../actions/apis";
import * as types from "../types/product";
import { toast } from "react-toastify";

export const fetchAddProductRequest = () => ({
  type: types.ADD_PRODUCT_REQUEST,
});

export const fetchAddProductSuccess = (data) => ({
  type: types.ADD_PRODUCT_SUCESS,
  data: data,
});

export const fetchAddProductFailed = (err) => ({
  type: types.ADD_PRODUCT_FAILED,
  err: err,
});

export const fetchAddProduct = (data, navigate) => (dispatch, getState) => {
  dispatch(fetchAddProductRequest());

  postApi(`/products`, data, true)
    .then((res) => {
      dispatch(fetchAddProductSuccess(res));
      navigate(`/product-details/${res?.data?.data?._id}`);
      toast.success(res?.data?.message);
    })
    .catch((err) => {
      dispatch(fetchAddProductFailed(err));
      toast.error(err?.data?.message);
    });
};
