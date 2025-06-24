import apiBase from "../interceptor/axiosBase";
import api from "../interceptor/axiosAuth";
const REST_API_BASE_URL_CATEGORY = `${
  import.meta.env.VITE_API_BASE_URL
}/categories`;
// get all categories
export const listCategories = () => apiBase.get(REST_API_BASE_URL_CATEGORY);
// add a category
export const addCategory = (category) =>
  api.post(REST_API_BASE_URL_CATEGORY, category);
// get by id
export const getCategory = (categoryId) =>
  apiBase.get(REST_API_BASE_URL_CATEGORY + "/" + categoryId);
// update
export const updateCategory = (categoryId, category) =>
  api.put(REST_API_BASE_URL_CATEGORY + "/" + categoryId, category);
// delete
export const deleteCategory = (categoryId) =>
  api.delete(REST_API_BASE_URL_CATEGORY + "/" + categoryId);
