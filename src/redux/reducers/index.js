import { combineReducers } from "redux";
import fetchAddProductReducer from "./addProductReducer";
import fetchProfileReducer from "./auth/getProfileReducer";
import fetchAllCategoriesReducer from "./category/getAllCategoryReducer";
import fetchEditProductReducer from "./editProductReducer";
import fetchAllProductsReducer from "./getAllProductsReducer";
import fetchInventoryReducer from "./getInventoryStatsReducer";
import fetchSingleProductReducer from "./getSingleProductReducer";

const rootReducer = combineReducers({
  allProductsData: fetchAllProductsReducer,
  addProductData: fetchAddProductReducer,
  singleProductData: fetchSingleProductReducer,
  editProductData: fetchEditProductReducer,
  profileData: fetchProfileReducer,
  inventoryData: fetchInventoryReducer,
  categoriesData: fetchAllCategoriesReducer,
});

export default rootReducer;
