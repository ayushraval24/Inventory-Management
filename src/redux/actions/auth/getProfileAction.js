import * as types from "../../types/auth";
import { getApi } from "../apis";

export const fetchProfileRequest = () => ({
  type: types.FETCH_PROFILE_REQUEST,
});

export const fetchProfileSuccess = (data) => ({
  type: types.FETCH_PROFILE_SUCCESS,
  data: data,
});

export const fetchProfileFailed = (err) => ({
  type: types.FETCH_PROFILE_FAILED,
  err: err,
});

export const fetchUserProfile = (id) => (dispatch, getState) => {
  dispatch(fetchProfileRequest());

  getApi(`/auth/profile`)
    .then((res) => {
      dispatch(fetchProfileSuccess(res));
    })
    .catch((err) => {
      dispatch(fetchProfileFailed(err));
    });
};
