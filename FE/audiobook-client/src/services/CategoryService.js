// src/services/CategoryService.js
import api from "../interceptor/axiosBase";

// Lấy toàn bộ danh mục
export const listCategories = () => api.get("/categories");

// Lấy chi tiết danh mục theo ID
export const getCategory = (categoryId) => api.get(`/categories/${categoryId}`);
