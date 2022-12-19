import * as types from "../../types/auth";

const initialState = {
  data: {},
  isLoading: false,
  error: null,
  message: "",
};

const fetchProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data.data.data,
        message: action.data.data.message,
      };

    case types.FETCH_PROFILE_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.err,
        message: action.data.data.message,
      };
    default:
      return state;
  }
};

export default fetchProfileReducer;