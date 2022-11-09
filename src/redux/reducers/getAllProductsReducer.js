import * as types from "../types/product";

const initialState = {
  data: [],
  count: 0,
  isLoading: false,
  error: null,
  message: "",
};

const fetchAllProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ALL_PRODUCTS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.FETCH_ALL_PRODUCTS_SUCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data.data.data,
        count: action.data.data.count,
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

export default fetchAllProductsReducer;
