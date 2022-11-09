import * as types from "../../types/category";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
  message: "",
  count: 0,
};

const fetchAllCategoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ALL_CATEGORIES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.FETCH_ALL_CATEGORIES_SUCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data.data.data,
        message: action.data.data.message,
        count: action.data.data.count,
      };

    case types.FETCH_ALL_CATEGORIES_FAILED:
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

export default fetchAllCategoriesReducer;
