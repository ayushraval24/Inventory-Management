import * as types from "../../types/auth";
import { putApi } from "../apis";
import { toast } from "react-toastify";

export const editProfileRequest = () => ({
  type: types.EDIT_PROFILE_REQUEST,
});

export const editProfileSuccess = (data) => ({
  type: types.EDIT_PROFILE_SUCCESS,
  data: data,
});

export const editProfileFailed = (err) => ({
  type: types.EDIT_PROFILE_SUCCESS,
  err: err,
});

export const fetchEditProfile = (data, navigate) => (dispatch, getState) => {
  dispatch(editProfileRequest());

  putApi(`/auth/profile`, data, true)
    .then((res) => {
      dispatch(editProfileSuccess(res));
      toast.success(res?.data?.message);
      navigate("/profile");
    })
    .catch((err) => {
      dispatch(editProfileFailed(err));
      toast.error(err?.data?.message);
    });
};
