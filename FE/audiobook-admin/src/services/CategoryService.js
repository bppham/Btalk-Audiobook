import axios from "axios";
const REST_API_BASE_URL_CATEGORY = `${import.meta.env.VITE_API_BASE_URL}/categories`;
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("token: ", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// get all categories
export const listCategories = () => axios.get(REST_API_BASE_URL_CATEGORY);
// add a category
export const addCategory = (category) =>
  axios.post(REST_API_BASE_URL_CATEGORY, category, {
    headers: getAuthHeaders(),
  });
// get by id
export const getCategory = (categoryId) =>
  axios.get(REST_API_BASE_URL_CATEGORY + "/" + categoryId);
// update
export const updateCategory = (categoryId, category) =>
  axios.put(REST_API_BASE_URL_CATEGORY + "/" + categoryId, category, {
    headers: getAuthHeaders(),
  });
// delete
export const deleteCategory = (categoryId) =>
  axios.delete(REST_API_BASE_URL_CATEGORY + "/" + categoryId, {
    headers: getAuthHeaders(),
  });
