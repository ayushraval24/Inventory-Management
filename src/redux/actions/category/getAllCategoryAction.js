import * as types from "../../types/category";
import { getApi } from "../apis";

export const fetchAllCategoriesRequest = () => ({
  type: types.FETCH_ALL_CATEGORIES_REQUEST,
});

export const fetchAllCategoriesSuccess = (data) => ({
  type: types.FETCH_ALL_CATEGORIES_SUCESS,
  data: data,
});

export const fetchAllCategoriesFailed = (err) => ({
  type: types.FETCH_ALL_CATEGORIES_FAILED,
  err: err,
});

export const fetchAllCategories = () => (dispatch, getState) => {
  dispatch(fetchAllCategoriesRequest());

  getApi(`/categories`)
    .then((res) => {
      dispatch(fetchAllCategoriesSuccess(res));
    })
    .catch((err) => {
      dispatch(fetchAllCategoriesFailed(err));
    });
};
