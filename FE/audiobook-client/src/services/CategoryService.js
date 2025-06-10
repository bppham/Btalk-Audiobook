import axios from "axios";
const REST_API_BASE_URL_CATEGORY = `${import.meta.env.VITE_API_BASE_URL}/categories`;
// get all categories
export const listCategories = () => axios.get(REST_API_BASE_URL_CATEGORY);
// add a category
export const getCategory = (categoryId) =>
  axios.get(REST_API_BASE_URL_CATEGORY + "/" + categoryId);