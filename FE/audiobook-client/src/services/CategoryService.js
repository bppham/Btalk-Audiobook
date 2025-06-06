import axios from "axios";
const REST_API_BASE_URL_CATEGORY = "http://localhost:8080/categories";
// get all categories
export const listCategories = () => axios.get(REST_API_BASE_URL_CATEGORY);
// add a category
export const getCategory = (categoryId) =>
  axios.get(REST_API_BASE_URL_CATEGORY + "/" + categoryId);