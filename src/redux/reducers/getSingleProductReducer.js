import * as types from "../types/product";

const initialState = {
  data: {},
  isLoading: false,
  error: null,
  message: "",
};

const fetchSingleProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_SINGLE_PRODUCT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.FETCH_SINGLE_PRODUCT_SUCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data.data.data,
        message: action.data.data.message,
      };

    case types.FETCH_ALL_PRODUCTS_FAILED:
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

export default fetchSingleProductReducer;
