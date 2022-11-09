import * as types from "../types/product";

const initialState = {
  data: {},
  isLoading: false,
  error: null,
  message: "",
};

const fetchInventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_INVENTORY_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.FETCH_INVENTORY_SUCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data.data.data,
        message: action.data.data.message,
      };

    case types.FETCH_INVENTORY_FAILED:
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

export default fetchInventoryReducer;
