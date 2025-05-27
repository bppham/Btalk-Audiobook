import axios from "axios"
const REST_API_BASE_URL_CATEGORY = "http://localhost:8080/categories";
// get all categories
export const listCategories = () => axios.get(REST_API_BASE_URL_CATEGORY);
// add a category
export const addCategory = (category) => axios.post(REST_API_BASE_URL_CATEGORY, category);
// get by id
export const getCategory = (categoryId) => axios.get(REST_API_BASE_URL_CATEGORY + '/' + categoryId);
// update
export const updateCategory = (categoryId, category) => axios.put(REST_API_BASE_URL_CATEGORY + '/' + categoryId, category);
// delete
export const deleteCategory = (categoryId) => axios.delete(REST_API_BASE_URL_CATEGORY + '/' + categoryId);